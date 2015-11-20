using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HouseOfTheFuture.Api.Host.Models
{
    public class IotHubSensor
    {
        [Key, Column(Order = 0)]
        public Guid HubId { get; set; }
        public IotHub Hub { get; set; }
        [Key, Column(Order = 1)]
        public Guid Id { get; set; }
        public string Description { get; set; }
    }
}