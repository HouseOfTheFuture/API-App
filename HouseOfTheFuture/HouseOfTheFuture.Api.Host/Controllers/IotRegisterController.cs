using System;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using HouseOfTheFuture.Api.Host.Handlers;

namespace HouseOfTheFuture.Api.Host.Controllers
{
    [RoutePrefix("iot/register")]
    public class IotRegisterController : ApiController
    {
        private readonly IotRegisterHandler _iotRegisterHandler;

        public IotRegisterController(IotRegisterHandler iotRegisterHandler)
        {
            _iotRegisterHandler = iotRegisterHandler;
        }

        [Route(Name = "IotRegisterController.Post"), HttpPost]
        [ResponseType(typeof(RegisterIotDeviceResponse))]
        public async Task<IHttpActionResult> Post(RegisterIotDeviceRequest register)
        {
            var result = await _iotRegisterHandler.Handle(register);

            return Ok(result);
    }
    }
}