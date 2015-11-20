using System.Data.Entity;
using System.Threading.Tasks;

namespace HouseOfTheFuture.Api.Host.Models
{
    public interface IDataContext
    {
        IDbSet<ApplicationUser> Users { get; set; }
        IDbSet<IotHub> IotHubs { get; set; }
        IDbSet<IotHubSensor> IotHubSensors { get; set; }
        IDbSet<SensorTick> Ticks { get; set; }
        Task<int> SaveChangesAsync();
    }
}
