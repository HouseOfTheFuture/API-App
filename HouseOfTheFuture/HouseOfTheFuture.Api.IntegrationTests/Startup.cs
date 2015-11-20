using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Core;
using Autofac.Integration.WebApi;
using HouseOfTheFuture.Api.Host;
using HouseOfTheFuture.Api.Host.Models;
using Owin;
using Module = Autofac.Module;

namespace HouseOfTheFuture.Api.IntegrationTests
{
    class Startup
    {
        public Startup()
        {
            FakeDbContext = new FakeDbContext();
        }

        public FakeDbContext FakeDbContext { get; }

        public void Configuration(IAppBuilder appBuilder)
        {
            // Configure Web API for self-host. 
            var config = new HttpConfiguration();

            var builder = new ContainerBuilder();
            builder.RegisterApiControllers(typeof(Host.Startup).Assembly);
            builder.RegisterModule(new FakeDataModule(FakeDbContext));
            // Register dependencies, then...
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            // Register the Autofac middleware FIRST. This also adds
            // Autofac-injected middleware registered with the container.
            appBuilder.UseAutofacMiddleware(container);

            WebApiConfiguration.Configure(appBuilder, config);
        }
    }

    class FakeDataModule : Module
    {
        private readonly FakeDbContext _dataContext;

        public FakeDataModule(FakeDbContext dataContext)
        {
            _dataContext = dataContext;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterInstance(_dataContext).As<IDataContext>();
        }
    }
}