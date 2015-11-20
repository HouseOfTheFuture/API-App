using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using HouseOfTheFuture.Api.Host.Controllers;
using HouseOfTheFuture.Api.Host.Models;
using HouseOfTheFuture.Api.Services;

namespace HouseOfTheFuture.Api.Host.Handlers
{
    public class IotRegisterHandler
        : IRequestHandler<RegisterIotDeviceRequest, Task<RegisterIotDeviceResponse>>
    {
        private readonly DataContext _dataContext;
        private readonly IotDeviceService _iotDeviceService;

        public IotRegisterHandler(DataContext dataContext, IotDeviceService iotDeviceService)
        {
            _dataContext = dataContext;
            _iotDeviceService = iotDeviceService;
        }

        public async Task<RegisterIotDeviceResponse> Handle(RegisterIotDeviceRequest request)
        {
            var iotHub = await _dataContext.IotHubs.FirstOrDefaultAsync(x => x.Id == request.CurrentDeviceId && !x.IsDeleted);
            if (iotHub == null)
            {
                iotHub = new IotHub
                {
                    Id = Guid.NewGuid(),
                    Description = ""
                };
                _dataContext.IotHubs.Add(iotHub);
                await _dataContext.SaveChangesAsync();
            }

            if (request.SensorIds != null && request.SensorIds.Any())
            {
                var currentSensors = await _dataContext.IotHubSensors.Where(x => x.HubId == iotHub.Id).Select(x => x.Id).ToArrayAsync();
                var newSensors = request.SensorIds.Where(x => !currentSensors.Contains(x));
                foreach (var newSensor in newSensors)
                {
                    _dataContext.IotHubSensors.Add(new IotHubSensor
                    {
                        Description = "",
                        Hub = iotHub,
                        Id = newSensor
                    });
                    await _dataContext.SaveChangesAsync();
                }
            }

            var iotDevice = await _iotDeviceService.AddDeviceAsync(iotHub.Id.ToString());

            return new RegisterIotDeviceResponse
            {
                DeviceId = iotHub.Id,
                IsConfigured = iotHub.Owner != null,
                HubDeviceKey = iotDevice.Authentication.SymmetricKey.PrimaryKey
            };
        }
    }

    public class RegisterIotDeviceRequest
    {
        public Guid? CurrentDeviceId { get; set; }
        public Guid[] SensorIds { get; set; }
    }
    public class RegisterIotDeviceResponse
    {
        public Guid DeviceId { get; set; }
        public bool IsConfigured { get; set; }
        public string HubDeviceKey { get; set; }
    }
}