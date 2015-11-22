using System;

namespace DummyData
{
    public abstract class Water : IUsage
    {
        public const double T1_2 = 0.5;
        public const double T3_4 = 1;
        public const double TicksPerLiter = 2;
        protected Water(double debietPerS)
        {
            TickInterval = TimeSpan.FromSeconds(1 / (debietPerS * TicksPerLiter));
        }
        public Guid SensorId { get; } = SensorIds.Water;
        public TimeSpan TickInterval { get; }
    }
}