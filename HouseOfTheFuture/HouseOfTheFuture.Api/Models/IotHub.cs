using System;

namespace HouseOfTheFuture.Api.Host.Models
{
    public class IotHub
    {
        public Guid Id { get; set; }
        public ApplicationUser Owner { get; set; }
        public string Description { get; set; }
        public bool IsDeleted { get; set; }
    }
}