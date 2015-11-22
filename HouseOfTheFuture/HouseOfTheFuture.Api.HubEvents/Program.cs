using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using HouseOfTheFuture.Api.Host.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.AspNet.SignalR.ServiceBus;
using Microsoft.Azure;
using Microsoft.Azure.WebJobs;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace HouseOfTheFuture.Api.HubEvents
{
    // To learn more about Microsoft Azure WebJobs SDK, please see http://go.microsoft.com/fwlink/?LinkID=320976
    public class Program
    {
        static string iotHubD2cEndpoint = "messages/events";
        static EventHubClient _eventHubClient;
        private static CloudTable _tickEvents;

        public static void Main()
        {
     //       string connectionString =
     //ConfigurationManager.ConnectionStrings["RootManageSharedAccessKey"].ConnectionString;
     //       Action<BrokeredMessage> callback = x =>
     //       {
                
     //       };
     //       var clients = new List<SubscriptionClient>();
     //       for (int i = 0; i < 5; i++)
     //       {
     //           var client = TopicClient.CreateFromConnectionString(connectionString, "signalr_topic_push_" + i);
     //           client.
     //           client.OnMessage(callback);
     //           clients.Add(client);
     //       }
     //       Console.ReadLine();
            //var ctx = GlobalHost.ConnectionManager.GetHubContext<yourhub>();
            //ctx.Clients.Client(connectionId).< your method >

            var cloudStorage = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["DataStorage"].ConnectionString);
            var tableClient = cloudStorage.CreateCloudTableClient();
            _tickEvents = tableClient.GetTableReference("tickevents");
            _tickEvents.CreateIfNotExists();
            var host = new JobHost();
            var cancelToken = new WebJobsShutdownWatcher().Token;
            _eventHubClient = EventHubClient.CreateFromConnectionString(ConfigurationManager.ConnectionStrings["IotHubConnection"].ConnectionString, iotHubD2cEndpoint);
            var d2CPartitions = _eventHubClient.GetRuntimeInformation().PartitionIds;
            Task.WaitAll(d2CPartitions.Select(partition => ListenForEvent(host, partition, cancelToken)).ToArray(), cancelToken);
            host.RunAndBlock();
        }

        private static Task ListenForEvent(JobHost host, string partition, CancellationToken cancelToken)
        {
            return Task.Run(() =>
            {
                Console.WriteLine("Start listener for partition '{0}'", partition);
                var eventHubReceiver = _eventHubClient.GetDefaultConsumerGroup().CreateReceiver(partition, DateTime.Now);
                while (true)
                {
                    var eventDataTask = eventHubReceiver.ReceiveAsync();
                    eventDataTask.Wait(cancelToken);
                    if (cancelToken.IsCancellationRequested)
                    {
                        cancelToken.ThrowIfCancellationRequested();
                    }
                    var eventData = eventDataTask.Result;
                    if (eventData == null) continue;
                    host.CallAsync(typeof(Program).GetMethod("ProcessMessage"), new { eventData, partition }, cancelToken);
                }
            }, cancelToken);
        }

        [NoAutomaticTrigger]
        public static async Task ProcessMessage(EventData eventData, string partition, CancellationToken cancelToken, TextWriter log)
        {
            var data = Encoding.UTF8.GetString(eventData.GetBytes());
            log.WriteLine("Message received. Partition: {0} Data: '{1}'", partition, data);

            var request = JsonConvert.DeserializeObject<PostRequest>(data);

            await SaveToTableStorage(eventData, cancelToken, request);
            await SaveToDatabase(cancelToken, request);
        }

        private static async Task SaveToTableStorage(EventData eventData, CancellationToken cancelToken, PostRequest request)
        {
            await
                _tickEvents.ExecuteAsync(
                    TableOperation.InsertOrReplace(
                        new TickEntity(Guid.Parse(eventData.SystemProperties["iothub-connection-device-id"].ToString()),
                            Guid.NewGuid())
                        {
                            Time = request.Timestamp,
                            Value = request.Value,
                            SensorId = request.SensorId
                        }), cancelToken);
        }

        private static async Task SaveToDatabase(CancellationToken cancelToken, PostRequest request)
        {
            var context = new DataContext();
            var sensor =
                await
                    context.IotHubSensors.FirstOrDefaultAsync(x => x.Id == request.SensorId && x.HubId == request.HubId,
                        cancelToken);
            if (sensor == null)
            {
                var hub = await context.IotHubs.FirstOrDefaultAsync(x => x.Id == request.HubId, cancelToken);
                sensor = new IotHubSensor
                {
                    Hub = hub,
                    Id = request.SensorId,
                    Description = ""
                };
                context.IotHubSensors.Add(sensor);
            }
            context.Ticks.Add(new SensorTick
            {
                Sensor = sensor,
                Value = request.Value,
                Timestamp = request.Timestamp
            });
            await context.SaveChangesAsync(cancelToken);
        }
    }
    public class TickEntity : TableEntity
    {
        public TickEntity() { }
        public TickEntity(Guid hubId, Guid messageId)
        {
            PartitionKey = hubId.ToString();
            RowKey = messageId.ToString();
        }

        public DateTime Time { get; set; }
        public Guid SensorId { get; set; }
        public double Value { get; set; }
    }
    public class PostRequest
    {
        public double Value { get; set; }
        public DateTime Timestamp { get; set; }
        public Guid SensorId { get; set; }
        public Guid HubId { get; set; }
    }
}
