using Autofac;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace HouseOfTheFuture.Api.Host.Models
{
    class DataModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<DataContext>().InstancePerDependency();
            builder.Register(x => x.Resolve<DataContext>()).As<IDataContext>().InstancePerRequest();
            builder.Register(x => new ApplicationUserManager(new UserStore<ApplicationUser>(x.Resolve<DataContext>()))).InstancePerRequest();
        }
    }
}
