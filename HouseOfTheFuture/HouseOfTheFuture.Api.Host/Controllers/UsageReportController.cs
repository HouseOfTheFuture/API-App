using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using HouseOfTheFuture.Api.Common;
using HouseOfTheFuture.Api.Host.Models;
using TypescriptGeneration;

namespace HouseOfTheFuture.Api.Host.Controllers
{
    [RoutePrefix("api/reports/usage/{hubId}")]
    public class UsageReportController : ApiController
    {
        private readonly IDataContext _dataContext;

        public UsageReportController(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [Route(Name = "Reports::Usage::Get"), HttpGet]
        public async Task<GetReportdataResponse> Get(Guid hubId, DateTime? from = null, DateTime? until = null, long? nrOfResults = null)
        {
            nrOfResults = (nrOfResults ?? 1920L/2L);
            from = from ?? DateTime.UtcNow.AddMonths(-1);
            until = until ?? DateTime.UtcNow;
            var hub = await _dataContext.IotHubs.FirstAsync(x => x.Id == hubId);
            var sensors = await _dataContext.IotHubSensors.Where(x => x.HubId == hubId).ToArrayAsync();
            var ticksInRange =
                await
                    _dataContext.Ticks.Where(x => from.Value <= x.Timestamp && x.Timestamp <= until.Value)
                        .ToArrayAsync()
                        .ContinueWith(x =>
                        {
                            var results = x.GetAwaiter().GetResult();
                            return results.GroupBy(s => s.SensorId)
                                .ToDictionary(s => s.Key, s => s.OrderBy(y => y.Timestamp).ToArray());
                        });

            var sensorData = new List<string>();
            var chunkedSensorData = new List<double[]>();
            var total = until.Value - from.Value;
            var block = new TimeSpan(total.Ticks / nrOfResults.Value);
            var labels = new List<DateTime>();
            for (var t = from.Value; t < until.Value.Subtract(block); t = t.Add(block))
            {
                labels.Add(t);
            }
            foreach (var iotHubSensor in sensors)
            {
                sensorData.Add(iotHubSensor.Description);
                var data = (ticksInRange).GetOrDefault(iotHubSensor.Id) ?? new SensorTick[0];
                var chunkedData = new List<double>();
                for (var t = from.Value; t < until.Value.Subtract(block); t = t.Add(block))
                {
                    var fromRange = t;
                    var toRange = t.Add(block);
                    var previousTickOutOfBounds = data.LastOrDefault(x => x.Timestamp <= fromRange);
                    var ticksInRangeD = data.Where(x => fromRange <= x.Timestamp && x.Timestamp <= toRange);
                    var nextTickOutOfBounds = data.FirstOrDefault(x => x.Timestamp >= toRange);
                    var allTicks = Enumerable.Empty<SensorTick>();
                    if (previousTickOutOfBounds != null)
                    {
                        allTicks = allTicks.Concat(new[] { previousTickOutOfBounds });
                    }
                    allTicks = allTicks.Concat(ticksInRangeD);
                    if (nextTickOutOfBounds != null)
                    {
                        allTicks = allTicks.Concat(new[] { nextTickOutOfBounds });
                    }
                    var formatted = allTicks.ToArray();
                    if (formatted.Count() < 2)
                    {
                        chunkedData.Add(0);
                        continue;
                    }
                    SensorTick previousTick = null;
                    double usage = 0;
                    foreach (var c in formatted)
                    {
                        if (previousTick == null)
                        {
                            previousTick = c;
                            continue;
                        }
                        var time = c.Timestamp - previousTick.Timestamp;
                        var usagePerHour = c.Value / time.TotalHours;
                        var fromTick = new DateTime(Math.Max(previousTick.Timestamp.Ticks, fromRange.Ticks));
                        var toTick = new DateTime(Math.Min(c.Timestamp.Ticks, toRange.Ticks));
                        var span = toTick - fromTick;
                        usage += usagePerHour*span.TotalHours;
                    }
                    chunkedData.Add(usage);
                }
                chunkedSensorData.Add(chunkedData.ToArray());
            }

            var response = new GetReportdataResponse
            {
                Sensors = sensorData.ToArray(),
                Data = chunkedSensorData.ToArray(),
                Labels = labels.Select(x => x.ToString()).ToArray()
            };

            return response;
        }
    }

    [Typescript]
    public class GetReportdataResponse
    {
        public string[] Sensors { get; set; }
        public string[] Labels { get; set; }
        public double[][] Data { get; set; }
    }

    public struct Point
    {
        public Point(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X;
        public double Y;
    }

    /// <summary>
    /// Bezier Spline methods
    /// </summary>
    public static class BezierSpline
    {
        /// <summary>
        /// Get open-ended Bezier Spline Control Points.
        /// </summary>
        /// <param name="knots">Input Knot Bezier spline points.</param>
        /// <param name="firstControlPoints">Output First Control points
        /// array of knots.Length - 1 length.</param>
        /// <param name="secondControlPoints">Output Second Control points
        /// array of knots.Length - 1 length.</param>
        /// <exception cref="ArgumentNullException"><paramref name="knots"/>
        /// parameter must be not null.</exception>
        /// <exception cref="ArgumentException"><paramref name="knots"/>
        /// array must contain at least two points.</exception>
        public static void GetCurveControlPoints(Point[] knots,
            out Point[] firstControlPoints, out Point[] secondControlPoints)
        {
            if (knots == null)
                throw new ArgumentNullException("knots");
            int n = knots.Length - 1;
            if (n < 1)
                throw new ArgumentException
                    ("At least two knot points required", "knots");
            if (n == 1)
            {
                // Special case: Bezier curve should be a straight line.
                firstControlPoints = new Point[1];
                // 3P1 = 2P0 + P3
                firstControlPoints[0].X = (2*knots[0].X + knots[1].X)/3;
                firstControlPoints[0].Y = (2*knots[0].Y + knots[1].Y)/3;

                secondControlPoints = new Point[1];
                // P2 = 2P1 – P0
                secondControlPoints[0].X = 2*
                                           firstControlPoints[0].X - knots[0].X;
                secondControlPoints[0].Y = 2*
                                           firstControlPoints[0].Y - knots[0].Y;
                return;
            }

            // Calculate first Bezier control points
            // Right hand side vector
            double[] rhs = new double[n];

            // Set right hand side X values
            for (int i = 1; i < n - 1; ++i)
                rhs[i] = 4*knots[i].X + 2*knots[i + 1].X;
            rhs[0] = knots[0].X + 2*knots[1].X;
            rhs[n - 1] = (8*knots[n - 1].X + knots[n].X)/2.0;
            // Get first control points X-values
            double[] x = GetFirstControlPoints(rhs);

            // Set right hand side Y values
            for (int i = 1; i < n - 1; ++i)
                rhs[i] = 4*knots[i].Y + 2*knots[i + 1].Y;
            rhs[0] = knots[0].Y + 2*knots[1].Y;
            rhs[n - 1] = (8*knots[n - 1].Y + knots[n].Y)/2.0;
            // Get first control points Y-values
            double[] y = GetFirstControlPoints(rhs);

            // Fill output arrays.
            firstControlPoints = new Point[n];
            secondControlPoints = new Point[n];
            for (int i = 0; i < n; ++i)
            {
                // First control point
                firstControlPoints[i] = new Point(x[i], y[i]);
                // Second control point
                if (i < n - 1)
                    secondControlPoints[i] = new Point(2*knots
                        [i + 1].X - x[i + 1], 2*
                                              knots[i + 1].Y - y[i + 1]);
                else
                    secondControlPoints[i] = new Point((knots
                        [n].X + x[n - 1])/2,
                        (knots[n].Y + y[n - 1])/2);
            }
        }

        /// <summary>
        /// Solves a tridiagonal system for one of coordinates (x or y)
        /// of first Bezier control points.
        /// </summary>
        /// <param name="rhs">Right hand side vector.</param>
        /// <returns>Solution vector.</returns>
        private static double[] GetFirstControlPoints(double[] rhs)
        {
            int n = rhs.Length;
            double[] x = new double[n]; // Solution vector.
            double[] tmp = new double[n]; // Temp workspace.

            double b = 2.0;
            x[0] = rhs[0]/b;
            for (int i = 1; i < n; i++) // Decomposition and forward substitution.
            {
                tmp[i] = 1/b;
                b = (i < n - 1 ? 4.0 : 3.5) - tmp[i];
                x[i] = (rhs[i] - x[i - 1])/b;
            }
            for (int i = 1; i < n; i++)
                x[n - i - 1] -= tmp[n - i]*x[n - i]; // Backsubstitution.

            return x;
        }
    }
}