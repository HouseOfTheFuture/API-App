using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Common.Exceptions;

namespace HouseOfTheFuture.Api.Services
{
    public class IotDeviceService
    {
        private readonly RegistryManager _registryManager;

        public IotDeviceService(RegistryManager registryManager)
        {
            _registryManager = registryManager;
        }

        public async Task<Device[]> GetAll()
        {
            return (await _registryManager.GetDevicesAsync(1000)).ToArray();
        }

        public async Task<Device> Get(Guid deviceId)
        {
            return await _registryManager.GetDeviceAsync(deviceId.ToString());
        }

        public async Task<Device> AddDeviceAsync(string deviceId)
        {
            Device device;
            try
            {
                device = await _registryManager.AddDeviceAsync(new Device(deviceId));
            }
            catch (DeviceAlreadyExistsException)
            {
                device = await _registryManager.GetDeviceAsync(deviceId);
            }

            return device;
        }

        public async Task RemoveDevice(Guid id)
        {
            await _registryManager.RemoveDeviceAsync(id.ToString());
        }
    }
}