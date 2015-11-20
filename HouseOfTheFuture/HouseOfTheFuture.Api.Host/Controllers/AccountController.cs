using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Web.Http;
using HouseOfTheFuture.Api.Host.Models;
using Microsoft.AspNet.Identity;

namespace HouseOfTheFuture.Api.Host.Controllers
{
    [RoutePrefix("account")]
    public class AccountController : ApiController
    {
        private readonly ApplicationUserManager _userManager;

        public AccountController(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }

        [Route("register"), HttpPost]
        public async Task<IHttpActionResult> Post(RegistrationDto register)
        {
            if (ModelState.IsValid)
            {
                var newUser = new ApplicationUser()
                {
                    UserName = register.Username,
                    Email = register.Username
                };

                var result = await _userManager.CreateAsync(newUser, register.Password);

                if (!result.Succeeded) return GetErrorResult(result);

                return Ok();
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
    public class RegistrationDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
