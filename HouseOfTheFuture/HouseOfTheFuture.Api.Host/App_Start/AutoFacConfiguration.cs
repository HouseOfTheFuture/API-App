using System.Configuration;
using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using HouseOfTheFuture.Api.Host.Controllers;
using HouseOfTheFuture.Api.Host.Handlers;
using HouseOfTheFuture.Api.Host.Models;
using HouseOfTheFuture.Api.Services;
using Microsoft.Azure.Devices;
using Owin;

namespace HouseOfTheFuture.Api.Host
{
    static class AutofacConfiguration
    {
        public static void Configure(IAppBuilder app, HttpConfiguration config)
        {
            var builder = new ContainerBuilder();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterModule(new DataModule());
            builder.RegisterType<IotRegisterHandler>();
            builder.RegisterType<IotDeviceService>();
            var iotHubConnection = ConfigurationManager.ConnectionStrings["IotHubConnection"].ConnectionString;
            builder.Register(x => RegistryManager.CreateFromConnectionString(iotHubConnection));

            // Register dependencies, then...
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            // Register the Autofac middleware FIRST. This also adds
            // Autofac-injected middleware registered with the container.
            app.UseAutofacMiddleware(container);
        }
    }
}
