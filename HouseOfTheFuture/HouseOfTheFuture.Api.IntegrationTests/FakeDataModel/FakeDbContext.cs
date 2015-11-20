using System;
using System.Data.Entity;
using System.Threading.Tasks;
using HouseOfTheFuture.Api.Host.Models;

namespace HouseOfTheFuture.Api.IntegrationTests
{
    class FakeDbContext : IDataContext
    {
        public FakeDbContext()
        {
            Users = new FakeDbSet<ApplicationUser>();
            IotHubs = new FakeDbSet<IotHub>();
            IotHubSensors = new FakeDbSet<IotHubSensor>();
            Ticks = new FakeDbSet<SensorTick>();
        }


        public virtual int SaveChanges()
        {
            return 0;
        }


        public virtual Task<int> SaveChangesAsync()
        {
            return Task.FromResult(0);
        }
        public virtual void Dispose()
        {
        }
        public Database Database
        {
            get { throw new NotImplementedException(); }
        }

        public IDbSet<SensorTick> Ticks { get; set; }
        public IDbSet<ApplicationUser> Users { get; set; }
        public IDbSet<IotHub> IotHubs { get; set; }
        public IDbSet<IotHubSensor> IotHubSensors { get; set; }
    }
}