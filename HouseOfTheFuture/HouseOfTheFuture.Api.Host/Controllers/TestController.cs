using System.Web.Http;

namespace HouseOfTheFuture.Api.Host.Controllers
{
    [Authorize]
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
