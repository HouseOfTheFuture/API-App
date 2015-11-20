using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using HouseOfTheFuture.Api.Common;
using HouseOfTheFuture.Api.Host.Models;
using TypescriptGeneration;

namespace HouseOfTheFuture.Api.Host.Controllers
{
    [RoutePrefix("api/reports/usage/{hubId}")]
    public class UsageReportController : ApiController
    {
        private readonly IDataContext _dataContext;

        public UsageReportController(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [Route(Name = "Reports::Usage::Get"), HttpGet]
        public async Task<GetReportdataResponse> Get(Guid hubId, DateTime? from = null, DateTime? until = null)
        {
            from = from ?? DateTime.UtcNow.AddMonths(-1);
            until = until ?? DateTime.UtcNow;
            var hub = await _dataContext.IotHubs.FirstAsync(x => x.Id == hubId);
            var sensors = await _dataContext.IotHubSensors.Where(x => x.HubId == hubId).ToArrayAsync();
            var ticksInRange = await _dataContext.Ticks.Where(x => from.Value <= x.Timestamp && x.Timestamp <= until.Value).ToArrayAsync()
                .ContinueWith(x =>
                {
                    var results = x.GetAwaiter().GetResult();
                    return results.GroupBy(s => s.SensorId).ToDictionary(s => s.Key, s => s.OrderBy(y => y.Timestamp).AsEnumerable());
                });


            var sensorData = new List<SensorResults>();

            foreach (var iotHubSensor in sensors)
            {
                var data = (ticksInRange).GetOrDefault(iotHubSensor.Id);
                SensorTick previousTick = null;
                var usageNodes = new List<UsageNode>();
                foreach (var sensorTick in data)
                {
                    if (previousTick != null)
                    {
                        var time = sensorTick.Timestamp - previousTick.Timestamp;
                        var averageUsagePerHour = sensorTick.Value/time.TotalHours;
                        usageNodes.Add(new UsageNode
                        {
                            FromTick = previousTick.Timestamp,
                            ToTick = sensorTick.Timestamp,
                            UsagePerHour = averageUsagePerHour
                        });
                    }
                    previousTick = sensorTick;
                }
                sensorData.Add(new SensorResults
                {
                    Name = iotHubSensor.Description,
                    UsageNodes = usageNodes.ToArray()
                });
            }

            var response = new GetReportdataResponse
            {
                From = from.Value,
                Until = until.Value,
                Name = hub.Description,
                Sensors = sensorData
            };

            return response;
        }
    }

    [Typescript]
    public class UsageNode
    {
        public DateTime FromTick { get; set; }
        public DateTime ToTick { get; set; }
        public double UsagePerHour { get; set; }
    }

    [Typescript]
    public class SensorResults
    {
        public string Name { get; set; }
        public UsageNode[] UsageNodes { get; set; }
    }

    [Typescript]
    public class GetReportdataResponse
    {
        public DateTime From { get; set; }
        public DateTime Until { get; set; }
        public string Name { get; set; }
        public IEnumerable<SensorResults> Sensors { get; set; }
    }
}
