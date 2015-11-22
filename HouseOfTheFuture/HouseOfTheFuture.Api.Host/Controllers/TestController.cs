using System.Web.Http;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;

namespace HouseOfTheFuture.Api.Host.Controllers
{
    [System.Web.Http.Authorize]
    [RoutePrefix("test")]
    public class TestController : ApiController
    {
        [Route("item")]
        [HttpGet]
        public IHttpActionResult Get()
        {
            return Ok("69");
        }
    }
}
