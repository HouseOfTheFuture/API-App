using System.Text;
using FluentAssertions;
using HouseOfTheFuture.Api.Host.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HouseOfTheFuture.Api.IntegrationTests
{
    [TestClass]
    public class RegisterIotDevice : BaseIntegrationTest
    {
        [TestMethod]
        public void Test()
        {
            // todo fix hans
            //var response = Post<RegisterIotDeviceRequest, RegisterIotDeviceResponse>("iot/register", new RegisterIotDeviceRequest
            //{
            //    CurrentDeviceId = null
            //}).Result;
            //response.IsConfigured.Should().BeFalse();
            //response.DeviceId.Should().NotBeEmpty();
        }
    }
}
