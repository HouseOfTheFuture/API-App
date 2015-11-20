using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TypescriptGeneration;

namespace HouseOfTheFuture.Api.Host.Controllers
{
    public class ServiceLocatorController : ApiController
    {
        [Route("api")]
        public ServiceLocations Get()
        {
            return new ServiceLocations
            {
                Devices = Url.Link("Devices::Get", new {}),
                RegisterDevice = Url.Link("IotRegisterController.Post", new {})
            };
        }
    }

    [Typescript]
    public class ServiceLocations
    {
        public string Devices { get; set; }
        public string RegisterDevice { get; set; }
    }
}
