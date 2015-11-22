using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DummyData
{
    class DagVerbruik
    {
        private Random _random;

        public void Test()
        {
            var beginJaar = new DateTime(2015, 1, 1);
            var eindeJaar = new DateTime(2015, 12, 31);
            _random = new Random();
            for (var dag = beginJaar; dag <= eindeJaar; dag = dag.AddDays(1))
            {
                RecordBadVerbruik(dag);
                RecordDoucheVerbruik(dag);
            }
        }

        private void RecordDoucheVerbruik(DateTime dag)
        {
            var douches = 1 + (dag.DayOfYear % 4 != 0 && dag.DayOfYear % 2 == 0 ? 1 : 0);

            if (dag.DayOfWeek == DayOfWeek.Saturday || dag.DayOfWeek == DayOfWeek.Sunday)
            {

            }
        }

        private void RecordBadVerbruik(DateTime dag)
        {
            var isBadDag = dag.DayOfYear % 4 == 0;

        }
    }
}
