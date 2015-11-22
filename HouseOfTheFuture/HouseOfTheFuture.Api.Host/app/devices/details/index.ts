module HouseOfTheFuture.Web.Devices.Details {
    import test = HouseOfTheFuture.Api.Host.Controllers;

    class Controller {
        static $inject = ["devices", "$http", "$stateParams", "$scope", "$interval"];
        options: any;

        constructor(devices: IDevices, private $http: angular.IHttpService, $stateParams: any, $scope: any, $interval:angular.IIntervalService) {
            this.options = {
                animation: false,
                showScale: false,
                showTooltips: false,
                pointDot: false,
                datasetStrokeWidth: 0.5
            };
            var maximum = document.getElementById('container').clientWidth / 2 || 300;
            $scope.data = [[]];
            $scope.labels = [];
            $scope.options = {
                animation: false,
                showScale: false,
                showTooltips: false,
                pointDot: false,
                datasetStrokeWidth: 0.5
            };

            // Update the dataset at 25FPS for a smoothly-animating chart
            $interval(function () {
                getLiveChartData();
            }, 1000);

            function getRandomValue(data:any) {
                var l = data.length, previous = l ? data[l - 1] : 50;
                var y = previous + Math.random() * 10 - 5;
                return y < 0 ? 0 : y > 100 ? 100 : y;
            }
            function getLiveChartData() {
                if ($scope.data[0].length) {
                    $scope.labels = $scope.labels.slice(1);
                    $scope.data[0] = $scope.data[0].slice(1);
                }

                while ($scope.data[0].length < maximum) {
                    $scope.labels.push('');
                    $scope.data[0].push(getRandomValue($scope.data[0]));
                }
            }
            devices.devicesPromise.then(x => {
                var device = _.find(x, z => z.id == $stateParams.deviceId);
                $http.get<test.GetReportdataResponse>(device.links.usageReport).success(data => {
                    this.reportData = data;
                });
            });
        }

        reportData: HouseOfTheFuture.Api.Host.Controllers.GetReportdataResponse;
    }

    app.controller("HouseOfTheFuture.Web.Devices.Details.DetailController", Controller);
}