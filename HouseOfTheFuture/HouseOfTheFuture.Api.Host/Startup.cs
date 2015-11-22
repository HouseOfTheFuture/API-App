using System.Configuration;
using System.Data.Entity;
using System.Web.Http;
using HouseOfTheFuture.Api.Host.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
using Configuration = HouseOfTheFuture.Api.Host.Migrations.Configuration;

[assembly: OwinStartup(typeof(HouseOfTheFuture.Api.Host.Startup))]
namespace HouseOfTheFuture.Api.Host
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<DataContext, Configuration>());
            var config = new HttpConfiguration();
            AutofacConfiguration.Configure(app, config);
            AuthenticationConfiguration.Configure(app);
            WebApiConfiguration.Configure(app, config);
            SwaggerConfiguration.Configure(config);
            GlobalHost.DependencyResolver.UseServiceBus(ConfigurationManager.ConnectionStrings["RootManageSharedAccessKey"].ConnectionString, "hotf-signalr");
            app.MapSignalR();
        }
    }
}
