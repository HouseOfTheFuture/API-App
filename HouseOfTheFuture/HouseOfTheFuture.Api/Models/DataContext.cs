using System;
using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace HouseOfTheFuture.Api.Host.Models
{
    public class DataContext
        : IdentityDbContext<ApplicationUser>, IDataContext
    {
        public DataContext()
            : base("name=DataContext")
        {
        }

        public IDbSet<IotHub> IotHubs { get; set; }
        public IDbSet<IotHubSensor> IotHubSensors { get; set; }
        public IDbSet<SensorTick> Ticks { get; set; }
    }

    public class SensorTick
    {
        public long Id { get; set; }
        public Guid SensorId { get; set; }
        public Guid SensorHubId { get; set; }
        public IotHubSensor Sensor { get; set; }
        public DateTime Timestamp { get; set; }
        public double Value { get; set; }
    }
}
