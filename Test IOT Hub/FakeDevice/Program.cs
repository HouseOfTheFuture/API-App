using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Client.Exceptions;
using Newtonsoft.Json;

namespace FakeDevice
{
    class Program
    {
        private static DeviceClient _deviceClient;

        static void Main(string[] args)
        {
            var response = Register().Result;
            Console.WriteLine("Simulated device\n");
            _deviceClient = DeviceClient.Create("hotf.azure-devices.net", new DeviceAuthenticationWithRegistrySymmetricKey(response.DeviceId.ToString(), response.HubDeviceKey), TransportType.Http1);

            SendDeviceToCloudMessagesAsync(response);
        }
        private static async void SendDeviceToCloudMessagesAsync(RegisterIotDeviceResponse response)
        {
            Random rand = new Random();
            var sensorIds = new[]
            {
                new {sensorId = Guid.Parse("83F4B957-6C16-4D40-8893-5220246541D8"), minimum = 5, maximum= 10},
                new {sensorId = Guid.Parse("9789701B-4A6D-487C-8D11-0CADAA1962E5"), minimum = 10, maximum = 30},
                new {sensorId = Guid.Parse("15D9D786-7DF1-4020-AD16-4CCCF78AC6A0"), minimum = 8, maximum= 12}
            };
            for (int day = 1; day <= 30;day++)
            {
                var date = new DateTime(2015,11, day);
                List<Task> tasks = new List<Task>();
                foreach (var sensorId in sensorIds)
                {
                    for (int i = 0; i <= rand.Next(sensorId.minimum, sensorId.maximum); i++)
                    {
                        var telemetryDataPoint = new
                        {
                            value = 1,
                            timestamp = date.AddMinutes(rand.Next(0, 60 * 24)),
                            sensorId = sensorId.sensorId,
                            hubId = response.DeviceId
                        };
                        var messageString = JsonConvert.SerializeObject(telemetryDataPoint);
                        var message = new Message(Encoding.ASCII.GetBytes(messageString));
                        message.MessageId = Guid.NewGuid().ToString();
                        tasks.Add(_deviceClient.SendEventAsync(message));
                        Console.WriteLine("{0} > Sending message: {1}", DateTime.Now, messageString);
                        Task.WaitAll(tasks.ToArray());
                        return;
                    }
                }
                Console.WriteLine("Waiting to complete for day {0}", day);
                Task.WaitAll(tasks.ToArray());
            }
        }

        private static async Task<RegisterIotDeviceResponse> Register()
        {
            var client = new HttpClient {BaseAddress = new Uri("https://hotf.azurewebsites.net") };
            var request = new RegisterIotDeviceRequest { CurrentDeviceId = Guid.Parse("78AD92C0-58B2-485D-9B24-E185FBF29A89") };
            var httpResponse = await client.PostAsync("iot/register", new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json"));
            var responseString = await httpResponse.Content.ReadAsStringAsync();
            var response = JsonConvert.DeserializeObject<RegisterIotDeviceResponse>(responseString);
            return response;
        }
    }


    public class RegisterIotDeviceRequest
    {
        public Guid? CurrentDeviceId { get; set; }
    }
    public class RegisterIotDeviceResponse
    {
        public Guid DeviceId { get; set; }
        public bool IsConfigured { get; set; }
        public string HubDeviceKey { get; set; }
    }
}
