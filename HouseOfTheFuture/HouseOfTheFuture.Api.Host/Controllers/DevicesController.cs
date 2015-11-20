using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using HouseOfTheFuture.Api.Host.Models;
using HouseOfTheFuture.Api.Services;
using TypescriptGeneration;

namespace HouseOfTheFuture.Api.Host.Controllers
{
    [RoutePrefix("api/devices")]
    public class DevicesController : ApiController
    {
        private readonly IDataContext _dataContext;
        private readonly IotDeviceService _deviceService;

        public DevicesController(IDataContext dataContext, IotDeviceService deviceService)
        {
            _dataContext = dataContext;
            _deviceService = deviceService;
        }

        [Route(Name="Devices::Get")]
        public GetDevicesResponse GetAll()
        {
            var hubs = _dataContext.IotHubs.Where(x => !x.IsDeleted).Select(x => new
            {
                x.Id,
                x.Description
            }).ToArray();
            return new GetDevicesResponse
            {
                Devices = hubs.Select(x => new DeviceDto
                {
                    Id = x.Id,
                    Description = x.Description,
                    Links = new DeviceLinks
                    {
                        Self = Url.Link("DeviceById::Get", new { deviceId = x.Id}),
                        UsageReport = Url.Link("Reports::Usage::Get", new {hubId = x.Id})
                    }
                }).ToArray(),
                Links = new GetDevicesLinks
                {
                    Sync = Url.Link("DevicesSync::Post", new {})
                }
            };
        }

        [Route("{deviceId}", Name = "DeviceById::Get")]
        public async Task<GetDeviceResponse> GetDevice(Guid deviceId)
        {
            var hub = await _dataContext.IotHubs.FirstAsync(x => x.Id == deviceId);
            return new GetDeviceResponse
            {
                Device = new DeviceDto
                {
                    Id = hub.Id,
                    Description = hub.Description,
                    Links = new DeviceLinks
                    {
                        Self = Url.Link("DeviceById::Get", new { deviceId = hub.Id })
                    }
                }
            };
        }

        [Route("{hubId}/sensors", Name = "Sensors::Get")]
        public async Task<GetSensorsResponse> GetSensors(Guid hubId)
        {
            var sensors = await _dataContext.IotHubSensors.Where(sensor => sensor.HubId == hubId).ToArrayAsync();

            return new GetSensorsResponse
            {
                Sensors = sensors.Select(s => new SensorDto()
                {
                    Id = s.Id,
                    Description = s.Description
                }).ToArray()
            };
        }

        [Route("{deviceId}", Name = "DeviceById::Delete")]
        public async Task Delete(Guid deviceId)
        {
            var hub = await _dataContext.IotHubs.FirstOrDefaultAsync(x => x.Id == deviceId);
            if (hub != null)
            {
                _dataContext.IotHubs.Remove(hub);
                await _deviceService.RemoveDevice(hub.Id);
                await _dataContext.SaveChangesAsync();
            }
        }


        [Route("sync", Name = "DevicesSync::Post"), HttpPost]
        public async Task SyncPost()
        {
            var devices = await _deviceService.GetAll();
            var deviceIds = devices.Select(x => new Guid(x.Id)).ToArray();
            var itemsToDelete = await _dataContext.IotHubs.Where(x => !x.IsDeleted && !deviceIds.Contains(x.Id)).ToListAsync();
            itemsToDelete.ForEach(x => x.IsDeleted = true);
            var itemsToActivate = await _dataContext.IotHubs.Where(x => x.IsDeleted && deviceIds.Contains(x.Id)).ToListAsync();
            itemsToActivate.ForEach(x => x.IsDeleted = false);

            var hashSet = new HashSet<Guid>(await _dataContext.IotHubs.Select(x => x.Id).ToArrayAsync());
            var devicesToRegister = devices.Where(x => !hashSet.Contains(new Guid(x.Id)));
                devicesToRegister.ToList().ForEach(x => _dataContext.IotHubs.Add(new IotHub
                {
                    Id = new Guid(x.Id),
                    Description = ""
                }));

            await _dataContext.SaveChangesAsync();
        }
    }

    [Typescript]
    public class GetDeviceResponse
    {
        public DeviceDto Device { get; set; }
    }

    [Typescript]
    public class DeviceLinks
    {
        public string Self { get; set; }
        public string UsageReport { get; set; }
    }

    [Typescript]
    public class GetDevicesResponse
    {
        public DeviceDto[] Devices { get; set; }
        public GetDevicesLinks Links { get; set; }
    }

    [Typescript]
    public class GetDevicesLinks
    {
        public string Sync { get; set; }
    }

    [Typescript]
    public class DeviceDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public DeviceLinks Links { get; set; }
    }

    [Typescript]
    public class GetSensorsResponse
    {
        public SensorDto[] Sensors { get; set; }
    }

    [Typescript]
    public class SensorDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
    }
}
