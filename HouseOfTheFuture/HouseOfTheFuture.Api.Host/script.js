var HouseOfTheFuture;
(function (HouseOfTheFuture) {
    var Api;
    (function (Api) {
        var Host;
        (function (Host) {
            var Controllers;
            (function (Controllers) {
                var GetDeviceResponse = (function () {
                    function GetDeviceResponse() {
                    }
                    return GetDeviceResponse;
                })();
                Controllers.GetDeviceResponse = GetDeviceResponse;
                var DeviceLinks = (function () {
                    function DeviceLinks() {
                    }
                    return DeviceLinks;
                })();
                Controllers.DeviceLinks = DeviceLinks;
                var GetDevicesResponse = (function () {
                    function GetDevicesResponse() {
                    }
                    return GetDevicesResponse;
                })();
                Controllers.GetDevicesResponse = GetDevicesResponse;
                var GetDevicesLinks = (function () {
                    function GetDevicesLinks() {
                    }
                    return GetDevicesLinks;
                })();
                Controllers.GetDevicesLinks = GetDevicesLinks;
                var DeviceDto = (function () {
                    function DeviceDto() {
                    }
                    return DeviceDto;
                })();
                Controllers.DeviceDto = DeviceDto;
                var GetSensorsResponse = (function () {
                    function GetSensorsResponse() {
                    }
                    return GetSensorsResponse;
                })();
                Controllers.GetSensorsResponse = GetSensorsResponse;
                var SensorDto = (function () {
                    function SensorDto() {
                    }
                    return SensorDto;
                })();
                Controllers.SensorDto = SensorDto;
                var ServiceLocations = (function () {
                    function ServiceLocations() {
                    }
                    return ServiceLocations;
                })();
                Controllers.ServiceLocations = ServiceLocations;
                var GetReportdataResponse = (function () {
                    function GetReportdataResponse() {
                    }
                    return GetReportdataResponse;
                })();
                Controllers.GetReportdataResponse = GetReportdataResponse;
            })(Controllers = Host.Controllers || (Host.Controllers = {}));
        })(Host = Api.Host || (Api.Host = {}));
    })(Api = HouseOfTheFuture.Api || (HouseOfTheFuture.Api = {}));
})(HouseOfTheFuture || (HouseOfTheFuture = {}));

/// <reference path="../typings/tsd.d.ts" />
var HouseOfTheFuture;
(function (HouseOfTheFuture) {
    var Web;
    (function (Web) {
        Web.app = angular.module("HouseOfTheFuture", ["ui.router", "chart.js", "SignalR"]);
        Web.root = "app/";
        $(function () {
            $("body").append("<div ui-view></div>");
            $("title").html("{{title}}");
            angular.bootstrap($("html"), ["HouseOfTheFuture"], { strictDi: true });
        });
        Web.app.factory("serviceLocations", ["$http", function ($http) { return $http.get("api").then(function (x) { return x.data; }); }]);
        Web.app.run(["$rootScope", function ($rootScope) { return $rootScope.title = "House of the Future"; }]);
    })(Web = HouseOfTheFuture.Web || (HouseOfTheFuture.Web = {}));
})(HouseOfTheFuture || (HouseOfTheFuture = {}));

var HouseOfTheFuture;
(function (HouseOfTheFuture) {
    var Web;
    (function (Web) {
        var Configure = (function () {
            function Configure($stateProvider, $urlRouterProvider, $locationProvider) {
                $locationProvider.html5Mode(true);
                $urlRouterProvider.otherwise("/");
                $stateProvider
                    .state("Root", {
                    url: "/",
                    templateUrl: Web.root + "layout.html",
                    abstract: true
                })
                    .state("Root.Dashboard", {
                    url: "",
                    template: "dashboard"
                })
                    .state("Root.Devices", {
                    url: "devices",
                    templateUrl: Web.root + "devices/index.html",
                    controller: "HouseOfTheFuture.Web.Devices.OverviewController as ctrl",
                    resolve: Web.Devices.Controller.resolve
                })
                    .state("Root.Devices.Details", {
                    url: "/:deviceId",
                    templateUrl: Web.root + "devices/details/index.html",
                    controller: "HouseOfTheFuture.Web.Devices.Details.DetailController as ctrl"
                });
            }
            Configure.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
            return Configure;
        })();
        Web.app.config(Configure);
        var ConfigureDebug = (function () {
            function ConfigureDebug($rootScope, $state) {
                this.$rootScope = $rootScope;
                this.$state = $state;
                this.stateChangeError = function (event, toState, toParams, fromState, fromParams, error) {
                    console.error("Failed to navigate from '" + JSON.stringify(fromState) + "' ('" + JSON.stringify(fromParams) + "') to '" + JSON.stringify(toState) + "' ('" + JSON.stringify(toParams) + "')", error);
                };
                this.stateChangeStart = function (event, toState, toParams, fromState, fromParams) {
                    console.info("state change start:\r\n", "from: '" + fromState.name + "' ('" + JSON.stringify(fromParams) + "')\n", "to: '" + toState.name + "' ('" + JSON.stringify(toParams) + "')");
                };
                $rootScope.$on("$stateChangeError", this.stateChangeError);
                $rootScope.$on("$stateChangeStart", this.stateChangeStart);
            }
            ConfigureDebug.$inject = ["$rootScope", "$state"];
            return ConfigureDebug;
        })();
        Web.app.run(ConfigureDebug);
    })(Web = HouseOfTheFuture.Web || (HouseOfTheFuture.Web = {}));
})(HouseOfTheFuture || (HouseOfTheFuture = {}));

///// <reference path="../app.ts" />
//module HouseOfTheFuture.Web.Auth {
//    import test = HouseOfTheFuture.Api.Host.Controllers;
//    class LoginController {
//        username: string;
//        password: string;
//        submit = () => {
//            this.$http({
//                method: "POST",
//                url: "account/token",
//                data: $.param({
//                    grant_type: "password",
//                    username: this.username,
//                    password: this.password
//                }),
//                headers: { 'Content-Type': "application/x-www-form-urlencoded" }
//            });
//        }
//    }
//    app.controller("LoginController", LoginController);
//} 

var HouseOfTheFuture;
(function (HouseOfTheFuture) {
    var Web;
    (function (Web) {
        var Devices;
        (function (Devices) {
            var Controller = (function () {
                function Controller(devices, $http) {
                    var _this = this;
                    this.devices = devices;
                    this.$http = $http;
                    this.sync = function () {
                        _this.$http.post(_this.devices.syncUrl, {})
                            .then(function (x) { return _this.devices.refresh(); });
                    };
                    this.delete = function (hub) {
                        _this.$http.delete(hub.links.self).then(function (x) { return _this.devices.refresh(); });
                    };
                }
                Controller.$inject = ["devices", "$http"];
                Controller.resolve = {
                    'devices': ["$http", "serviceLocations", function ($http, serviceLocations) {
                            var results = {};
                            results.refresh = function () {
                                var result = serviceLocations.then(function (x) {
                                    return $http.get(x.devices).then(function (y) { return y.data; });
                                });
                                results.devicesPromise = result.then(function (x) {
                                    results.devices = x.devices;
                                    return x.devices;
                                });
                                results.syncUrlPromise = result.then(function (x) {
                                    results.syncUrl = x.links.sync;
                                    return x.links.sync;
                                });
                            };
                            results.refresh();
                            return results;
                        }]
                };
                return Controller;
            })();
            Devices.Controller = Controller;
            Web.app.controller("HouseOfTheFuture.Web.Devices.OverviewController", Controller);
        })(Devices = Web.Devices || (Web.Devices = {}));
    })(Web = HouseOfTheFuture.Web || (HouseOfTheFuture.Web = {}));
})(HouseOfTheFuture || (HouseOfTheFuture = {}));

var HouseOfTheFuture;
(function (HouseOfTheFuture) {
    var Web;
    (function (Web) {
        var HubClient = (function () {
            function HubClient(root) {
                this.root = root;
                this.helloWorld = function (text) {
                    console.log("HelloWorld: " + text);
                };
            }
            return HubClient;
        })();
        var Configure = (function () {
            function Configure($rootScope, hubClass) {
                var hub = new hubClass("main", {
                    listeners: new HubClient($rootScope),
                    rootPath: "signalr"
                });
                hub.connect();
            }
            Configure.$inject = ["$rootScope", "Hub"];
            return Configure;
        })();
        Web.app.run(Configure);
    })(Web = HouseOfTheFuture.Web || (HouseOfTheFuture.Web = {}));
})(HouseOfTheFuture || (HouseOfTheFuture = {}));

var HouseOfTheFuture;
(function (HouseOfTheFuture) {
    var Web;
    (function (Web) {
        var Devices;
        (function (Devices) {
            var Details;
            (function (Details) {
                var Controller = (function () {
                    function Controller(devices, $http, $stateParams, $scope, $interval) {
                        var _this = this;
                        this.$http = $http;
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
                        function getRandomValue(data) {
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
                        devices.devicesPromise.then(function (x) {
                            var device = _.find(x, function (z) { return z.id == $stateParams.deviceId; });
                            $http.get(device.links.usageReport).success(function (data) {
                                _this.reportData = data;
                            });
                        });
                    }
                    Controller.$inject = ["devices", "$http", "$stateParams", "$scope", "$interval"];
                    return Controller;
                })();
                Web.app.controller("HouseOfTheFuture.Web.Devices.Details.DetailController", Controller);
            })(Details = Devices.Details || (Devices.Details = {}));
        })(Devices = Web.Devices || (Web.Devices = {}));
    })(Web = HouseOfTheFuture.Web || (HouseOfTheFuture.Web = {}));
})(HouseOfTheFuture || (HouseOfTheFuture = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyYWN0cy5nZW5lcmF0ZWQudHMiLCJhcHAvYXBwLnRzIiwiYXBwL3JvdXRlcy50cyIsImFwcC9hdXRoL2F1dGgudHMiLCJhcHAvZGV2aWNlcy9pbmRleC50cyIsImFwcC9zaWduYWxyL2FwcC5ydW4uc2lnbmFsci50cyIsImFwcC9kZXZpY2VzL2RldGFpbHMvaW5kZXgudHMiXSwibmFtZXMiOlsiSG91c2VPZlRoZUZ1dHVyZSIsIkhvdXNlT2ZUaGVGdXR1cmUuQXBpIiwiSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdCIsIkhvdXNlT2ZUaGVGdXR1cmUuQXBpLkhvc3QuQ29udHJvbGxlcnMiLCJIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLkdldERldmljZVJlc3BvbnNlIiwiSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycy5HZXREZXZpY2VSZXNwb25zZS5jb25zdHJ1Y3RvciIsIkhvdXNlT2ZUaGVGdXR1cmUuQXBpLkhvc3QuQ29udHJvbGxlcnMuRGV2aWNlTGlua3MiLCJIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLkRldmljZUxpbmtzLmNvbnN0cnVjdG9yIiwiSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycy5HZXREZXZpY2VzUmVzcG9uc2UiLCJIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLkdldERldmljZXNSZXNwb25zZS5jb25zdHJ1Y3RvciIsIkhvdXNlT2ZUaGVGdXR1cmUuQXBpLkhvc3QuQ29udHJvbGxlcnMuR2V0RGV2aWNlc0xpbmtzIiwiSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycy5HZXREZXZpY2VzTGlua3MuY29uc3RydWN0b3IiLCJIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLkRldmljZUR0byIsIkhvdXNlT2ZUaGVGdXR1cmUuQXBpLkhvc3QuQ29udHJvbGxlcnMuRGV2aWNlRHRvLmNvbnN0cnVjdG9yIiwiSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycy5HZXRTZW5zb3JzUmVzcG9uc2UiLCJIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLkdldFNlbnNvcnNSZXNwb25zZS5jb25zdHJ1Y3RvciIsIkhvdXNlT2ZUaGVGdXR1cmUuQXBpLkhvc3QuQ29udHJvbGxlcnMuU2Vuc29yRHRvIiwiSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycy5TZW5zb3JEdG8uY29uc3RydWN0b3IiLCJIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLlNlcnZpY2VMb2NhdGlvbnMiLCJIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLlNlcnZpY2VMb2NhdGlvbnMuY29uc3RydWN0b3IiLCJIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLkdldFJlcG9ydGRhdGFSZXNwb25zZSIsIkhvdXNlT2ZUaGVGdXR1cmUuQXBpLkhvc3QuQ29udHJvbGxlcnMuR2V0UmVwb3J0ZGF0YVJlc3BvbnNlLmNvbnN0cnVjdG9yIiwiSG91c2VPZlRoZUZ1dHVyZS5XZWIiLCJIb3VzZU9mVGhlRnV0dXJlLldlYi5Db25maWd1cmUiLCJIb3VzZU9mVGhlRnV0dXJlLldlYi5Db25maWd1cmUuY29uc3RydWN0b3IiLCJIb3VzZU9mVGhlRnV0dXJlLldlYi5Db25maWd1cmVEZWJ1ZyIsIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkNvbmZpZ3VyZURlYnVnLmNvbnN0cnVjdG9yIiwiSG91c2VPZlRoZUZ1dHVyZS5XZWIuRGV2aWNlcyIsIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkRldmljZXMuQ29udHJvbGxlciIsIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkRldmljZXMuQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkh1YkNsaWVudCIsIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkh1YkNsaWVudC5jb25zdHJ1Y3RvciIsIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkRldmljZXMuRGV0YWlscyIsIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkRldmljZXMuRGV0YWlscy5Db250cm9sbGVyIiwiSG91c2VPZlRoZUZ1dHVyZS5XZWIuRGV2aWNlcy5EZXRhaWxzLkNvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJIb3VzZU9mVGhlRnV0dXJlLldlYi5EZXZpY2VzLkRldGFpbHMuQ29udHJvbGxlci5jb25zdHJ1Y3Rvci5nZXRSYW5kb21WYWx1ZSIsIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkRldmljZXMuRGV0YWlscy5Db250cm9sbGVyLmNvbnN0cnVjdG9yLmdldExpdmVDaGFydERhdGEiXSwibWFwcGluZ3MiOiJBQVFBLElBQU8sZ0JBQWdCLENBb0N0QjtBQXBDRCxXQUFPLGdCQUFnQjtJQUFDQSxJQUFBQSxHQUFHQSxDQW9DMUJBO0lBcEN1QkEsV0FBQUEsR0FBR0E7UUFBQ0MsSUFBQUEsSUFBSUEsQ0FvQy9CQTtRQXBDMkJBLFdBQUFBLElBQUlBO1lBQUNDLElBQUFBLFdBQVdBLENBb0MzQ0E7WUFwQ2dDQSxXQUFBQSxXQUFXQSxFQUFDQSxDQUFDQTtnQkFDN0NDO29CQUFBQztvQkFFQUMsQ0FBQ0E7b0JBQURELHdCQUFDQTtnQkFBREEsQ0FGQUQsQUFFQ0MsSUFBQUQ7Z0JBRllBLDZCQUFpQkEsb0JBRTdCQSxDQUFBQTtnQkFDREE7b0JBQUFHO29CQUdBQyxDQUFDQTtvQkFBREQsa0JBQUNBO2dCQUFEQSxDQUhBSCxBQUdDRyxJQUFBSDtnQkFIWUEsdUJBQVdBLGNBR3ZCQSxDQUFBQTtnQkFDREE7b0JBQUFLO29CQUdBQyxDQUFDQTtvQkFBREQseUJBQUNBO2dCQUFEQSxDQUhBTCxBQUdDSyxJQUFBTDtnQkFIWUEsOEJBQWtCQSxxQkFHOUJBLENBQUFBO2dCQUNEQTtvQkFBQU87b0JBRUFDLENBQUNBO29CQUFERCxzQkFBQ0E7Z0JBQURBLENBRkFQLEFBRUNPLElBQUFQO2dCQUZZQSwyQkFBZUEsa0JBRTNCQSxDQUFBQTtnQkFDREE7b0JBQUFTO29CQUlBQyxDQUFDQTtvQkFBREQsZ0JBQUNBO2dCQUFEQSxDQUpBVCxBQUlDUyxJQUFBVDtnQkFKWUEscUJBQVNBLFlBSXJCQSxDQUFBQTtnQkFDREE7b0JBQUFXO29CQUVBQyxDQUFDQTtvQkFBREQseUJBQUNBO2dCQUFEQSxDQUZBWCxBQUVDVyxJQUFBWDtnQkFGWUEsOEJBQWtCQSxxQkFFOUJBLENBQUFBO2dCQUNEQTtvQkFBQWE7b0JBR0FDLENBQUNBO29CQUFERCxnQkFBQ0E7Z0JBQURBLENBSEFiLEFBR0NhLElBQUFiO2dCQUhZQSxxQkFBU0EsWUFHckJBLENBQUFBO2dCQUNEQTtvQkFBQWU7b0JBR0FDLENBQUNBO29CQUFERCx1QkFBQ0E7Z0JBQURBLENBSEFmLEFBR0NlLElBQUFmO2dCQUhZQSw0QkFBZ0JBLG1CQUc1QkEsQ0FBQUE7Z0JBQ0RBO29CQUFBaUI7b0JBSUFDLENBQUNBO29CQUFERCw0QkFBQ0E7Z0JBQURBLENBSkFqQixBQUlDaUIsSUFBQWpCO2dCQUpZQSxpQ0FBcUJBLHdCQUlqQ0EsQ0FBQUE7WUFDRkEsQ0FBQ0EsRUFwQ2dDRCxXQUFXQSxHQUFYQSxnQkFBV0EsS0FBWEEsZ0JBQVdBLFFBb0MzQ0E7UUFBREEsQ0FBQ0EsRUFwQzJCRCxJQUFJQSxHQUFKQSxRQUFJQSxLQUFKQSxRQUFJQSxRQW9DL0JBO0lBQURBLENBQUNBLEVBcEN1QkQsR0FBR0EsR0FBSEEsb0JBQUdBLEtBQUhBLG9CQUFHQSxRQW9DMUJBO0FBQURBLENBQUNBLEVBcENNLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFvQ3RCOztBQzVDRCw0Q0FBNEM7QUFDNUMsSUFBTyxnQkFBZ0IsQ0FnQnRCO0FBaEJELFdBQU8sZ0JBQWdCO0lBQUNBLElBQUFBLEdBQUdBLENBZ0IxQkE7SUFoQnVCQSxXQUFBQSxHQUFHQSxFQUFDQSxDQUFDQTtRQU9kc0IsT0FBR0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQSxXQUFXQSxFQUFFQSxVQUFVQSxFQUFFQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMvRUEsUUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFDekJBLENBQUNBLENBQUNBO1lBQ0VBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0E7WUFDeENBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO1lBQzdCQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxrQkFBa0JBLENBQUNBLEVBQUVBLEVBQUNBLFFBQVFBLEVBQUNBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO1FBQ3hFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNIQSxPQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxrQkFBa0JBLEVBQUVBLENBQUNBLE9BQU9BLEVBQUVBLFVBQUNBLEtBQTJCQSxJQUFLQSxPQUFBQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUF3QkEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBTkEsQ0FBTUEsQ0FBQ0EsRUFBekRBLENBQXlEQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN2SUEsT0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsRUFBRUEsVUFBQ0EsVUFBZUEsSUFBS0EsT0FBQUEsVUFBVUEsQ0FBQ0EsS0FBS0EsR0FBR0EscUJBQXFCQSxFQUF4Q0EsQ0FBd0NBLENBQUNBLENBQUNBLENBQUNBO0lBQzNGQSxDQUFDQSxFQWhCdUJ0QixHQUFHQSxHQUFIQSxvQkFBR0EsS0FBSEEsb0JBQUdBLFFBZ0IxQkE7QUFBREEsQ0FBQ0EsRUFoQk0sZ0JBQWdCLEtBQWhCLGdCQUFnQixRQWdCdEI7O0FDakJELElBQU8sZ0JBQWdCLENBa0R0QjtBQWxERCxXQUFPLGdCQUFnQjtJQUFDQSxJQUFBQSxHQUFHQSxDQWtEMUJBO0lBbER1QkEsV0FBQUEsR0FBR0EsRUFBQ0EsQ0FBQ0E7UUFDekJzQjtZQUVJQyxtQkFBWUEsY0FBd0NBLEVBQUVBLGtCQUFnREEsRUFBRUEsaUJBQTJDQTtnQkFDL0lDLGlCQUFpQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xDQSxrQkFBa0JBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNsQ0EsY0FBY0E7cUJBQ1RBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBO29CQUNYQSxHQUFHQSxFQUFFQSxHQUFHQTtvQkFDUkEsV0FBV0EsRUFBRUEsUUFBSUEsR0FBR0EsYUFBYUE7b0JBQ2pDQSxRQUFRQSxFQUFFQSxJQUFJQTtpQkFDakJBLENBQUNBO3FCQUNEQSxLQUFLQSxDQUFDQSxnQkFBZ0JBLEVBQUVBO29CQUNyQkEsR0FBR0EsRUFBRUEsRUFBRUE7b0JBQ1BBLFFBQVFBLEVBQUVBLFdBQVdBO2lCQUN4QkEsQ0FBQ0E7cUJBQ0RBLEtBQUtBLENBQUNBLGNBQWNBLEVBQUVBO29CQUNuQkEsR0FBR0EsRUFBRUEsU0FBU0E7b0JBQ2RBLFdBQVdBLEVBQUVBLFFBQUlBLEdBQUdBLG9CQUFvQkE7b0JBQ3hDQSxVQUFVQSxFQUFFQSx5REFBeURBO29CQUNyRUEsT0FBT0EsRUFBRUEsV0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0E7aUJBQ3RDQSxDQUFDQTtxQkFDREEsS0FBS0EsQ0FBQ0Esc0JBQXNCQSxFQUFFQTtvQkFDM0JBLEdBQUdBLEVBQUVBLFlBQVlBO29CQUNqQkEsV0FBV0EsRUFBRUEsUUFBSUEsR0FBR0EsNEJBQTRCQTtvQkFDaERBLFVBQVVBLEVBQUVBLCtEQUErREE7aUJBQzlFQSxDQUFDQSxDQUFDQTtZQUNYQSxDQUFDQTtZQXpCTUQsaUJBQU9BLEdBQUdBLENBQUNBLGdCQUFnQkEsRUFBRUEsb0JBQW9CQSxFQUFFQSxtQkFBbUJBLENBQUNBLENBQUNBO1lBMEJuRkEsZ0JBQUNBO1FBQURBLENBM0JBRCxBQTJCQ0MsSUFBQUQ7UUFDREEsT0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDbEJBO1lBRUlHLHdCQUFvQkEsVUFBY0EsRUFBVUEsTUFBZ0NBO2dCQUF4REMsZUFBVUEsR0FBVkEsVUFBVUEsQ0FBSUE7Z0JBQVVBLFdBQU1BLEdBQU5BLE1BQU1BLENBQTBCQTtnQkFJNUVBLHFCQUFnQkEsR0FBR0EsVUFBQ0EsS0FBVUEsRUFBRUEsT0FBWUEsRUFBRUEsUUFBYUEsRUFBRUEsU0FBY0EsRUFBRUEsVUFBZUEsRUFBRUEsS0FBVUE7b0JBQ3BHQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSwyQkFBMkJBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLElBQUlBLEVBQ3hMQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDZkEsQ0FBQ0EsQ0FBQ0E7Z0JBRUZBLHFCQUFnQkEsR0FBR0EsVUFBQ0EsS0FBVUEsRUFBRUEsT0FBWUEsRUFBRUEsUUFBYUEsRUFBRUEsU0FBY0EsRUFBRUEsVUFBZUE7b0JBQ3hGQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSx5QkFBeUJBLEVBQ2xDQSxZQUFVQSxTQUFTQSxDQUFDQSxJQUFJQSxZQUFPQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxDQUFDQSxTQUM1RUEsRUFDbUJBLFVBQVFBLE9BQU9BLENBQUNBLElBQUlBLFlBQU9BLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLE9BQUtBLENBQUNBLENBQUNBO2dCQUNsRUEsQ0FBQ0EsQ0FBQ0E7Z0JBYkVBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLG1CQUFtQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQTtnQkFDM0RBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLG1CQUFtQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxDQUFDQTtZQUMvREEsQ0FBQ0E7WUFKTUQsc0JBQU9BLEdBQUdBLENBQUNBLFlBQVlBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBO1lBZ0I5Q0EscUJBQUNBO1FBQURBLENBakJBSCxBQWlCQ0csSUFBQUg7UUFDREEsT0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7SUFFaENBLENBQUNBLEVBbER1QnRCLEdBQUdBLEdBQUhBLG9CQUFHQSxLQUFIQSxvQkFBR0EsUUFrRDFCQTtBQUFEQSxDQUFDQSxFQWxETSxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBa0R0Qjs7QUNsREQsb0NBQW9DO0FBQ3BDLG9DQUFvQztBQUNwQywwREFBMEQ7QUFDMUQsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQixpQ0FBaUM7QUFDakMsdUNBQXVDO0FBQ3ZDLGlDQUFpQztBQUNqQyw2Q0FBNkM7QUFDN0MsOENBQThDO0FBQzlDLDZDQUE2QztBQUM3QyxxQkFBcUI7QUFDckIsa0ZBQWtGO0FBQ2xGLGlCQUFpQjtBQUNqQixXQUFXO0FBQ1gsT0FBTztBQUNQLHlEQUF5RDtBQUN6RCxHQUFHOztBQ3BCSCxJQUFPLGdCQUFnQixDQTJDdEI7QUEzQ0QsV0FBTyxnQkFBZ0I7SUFBQ0EsSUFBQUEsR0FBR0EsQ0EyQzFCQTtJQTNDdUJBLFdBQUFBLEdBQUdBO1FBQUNzQixJQUFBQSxPQUFPQSxDQTJDbENBO1FBM0MyQkEsV0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0E7WUFFakNLO2dCQUVJQyxvQkFBb0JBLE9BQWlCQSxFQUFVQSxLQUEwQkE7b0JBRjdFQyxpQkFnQ0NBO29CQTlCdUJBLFlBQU9BLEdBQVBBLE9BQU9BLENBQVVBO29CQUFVQSxVQUFLQSxHQUFMQSxLQUFLQSxDQUFxQkE7b0JBRXpFQSxTQUFJQSxHQUFHQTt3QkFDSEEsS0FBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsRUFBRUEsRUFBRUEsQ0FBQ0E7NkJBQ3BDQSxJQUFJQSxDQUFDQSxVQUFBQSxDQUFDQSxJQUFJQSxPQUFBQSxLQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxFQUFFQSxFQUF0QkEsQ0FBc0JBLENBQUNBLENBQUNBO29CQUMzQ0EsQ0FBQ0EsQ0FBQUE7b0JBQ0RBLFdBQU1BLEdBQUdBLFVBQUNBLEdBQW1CQTt3QkFDekJBLEtBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQUFBLENBQUNBLElBQUlBLE9BQUFBLEtBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLEVBQUVBLEVBQXRCQSxDQUFzQkEsQ0FBQ0EsQ0FBQ0E7b0JBQ3hFQSxDQUFDQSxDQUFBQTtnQkFQREEsQ0FBQ0E7Z0JBRk1ELGtCQUFPQSxHQUFHQSxDQUFDQSxTQUFTQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtnQkFXL0JBLGtCQUFPQSxHQUFzQkE7b0JBQzVCQSxTQUFTQSxFQUFFQSxDQUFDQSxPQUFPQSxFQUFFQSxrQkFBa0JBLEVBQUVBLFVBQUNBLEtBQTJCQSxFQUFFQSxnQkFBbUNBOzRCQUN0R0EsSUFBSUEsT0FBT0EsR0FBYUEsRUFBRUEsQ0FBQ0E7NEJBQzNCQSxPQUFPQSxDQUFDQSxPQUFPQSxHQUFHQTtnQ0FDZEEsSUFBSUEsTUFBTUEsR0FBR0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFBQSxDQUFDQTtvQ0FDaENBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQTBCQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFBQSxDQUFDQSxJQUFJQSxPQUFBQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFOQSxDQUFNQSxDQUFDQSxDQUFDQTtnQ0FDM0VBLENBQUNBLENBQUNBLENBQUNBO2dDQUNIQSxPQUFPQSxDQUFDQSxjQUFjQSxHQUFHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFBQSxDQUFDQTtvQ0FDbENBLE9BQU9BLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBO29DQUM1QkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0NBQ3JCQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDSEEsT0FBT0EsQ0FBQ0EsY0FBY0EsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBQUEsQ0FBQ0E7b0NBQ2xDQSxPQUFPQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQTtvQ0FDL0JBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBO2dDQUN4QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ1BBLENBQUNBLENBQUFBOzRCQUNEQSxPQUFPQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTs0QkFDbEJBLE1BQU1BLENBQVdBLE9BQU9BLENBQUNBO3dCQUM3QkEsQ0FBQ0EsQ0FBQ0E7aUJBQ0xBLENBQUFBO2dCQUNUQSxpQkFBQ0E7WUFBREEsQ0FoQ0FELEFBZ0NDQyxJQUFBRDtZQWhDWUEsa0JBQVVBLGFBZ0N0QkEsQ0FBQUE7WUFRREEsT0FBR0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsaURBQWlEQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUNsRkEsQ0FBQ0EsRUEzQzJCTCxPQUFPQSxHQUFQQSxXQUFPQSxLQUFQQSxXQUFPQSxRQTJDbENBO0lBQURBLENBQUNBLEVBM0N1QnRCLEdBQUdBLEdBQUhBLG9CQUFHQSxLQUFIQSxvQkFBR0EsUUEyQzFCQTtBQUFEQSxDQUFDQSxFQTNDTSxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBMkN0Qjs7QUMzQ0QsSUFBTyxnQkFBZ0IsQ0FxQnRCO0FBckJELFdBQU8sZ0JBQWdCO0lBQUNBLElBQUFBLEdBQUdBLENBcUIxQkE7SUFyQnVCQSxXQUFBQSxHQUFHQSxFQUFDQSxDQUFDQTtRQUN6QnNCO1lBRUlRLG1CQUFvQkEsSUFBK0JBO2dCQUEvQkMsU0FBSUEsR0FBSkEsSUFBSUEsQ0FBMkJBO2dCQUduREEsZUFBVUEsR0FBR0EsVUFBQ0EsSUFBWUE7b0JBQ3RCQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDdkNBLENBQUNBLENBQUFBO1lBSkRBLENBQUNBO1lBS0xELGdCQUFDQTtRQUFEQSxDQVJBUixBQVFDUSxJQUFBUjtRQUNEQTtZQUVJQyxtQkFBWUEsVUFBc0NBLEVBQUNBLFFBQThCQTtnQkFDN0VDLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBO29CQUMzQkEsU0FBU0EsRUFBT0EsSUFBSUEsU0FBU0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7b0JBQ3pDQSxRQUFRQSxFQUFFQSxTQUFTQTtpQkFDdEJBLENBQUNBLENBQUNBO2dCQUNIQSxHQUFHQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtZQUNsQkEsQ0FBQ0E7WUFQTUQsaUJBQU9BLEdBQUdBLENBQUNBLFlBQVlBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1lBUTNDQSxnQkFBQ0E7UUFBREEsQ0FUQUQsQUFTQ0MsSUFBQUQ7UUFDREEsT0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFDdkJBLENBQUNBLEVBckJ1QnRCLEdBQUdBLEdBQUhBLG9CQUFHQSxLQUFIQSxvQkFBR0EsUUFxQjFCQTtBQUFEQSxDQUFDQSxFQXJCTSxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBcUJ0Qjs7QUNyQkQsSUFBTyxnQkFBZ0IsQ0EyRHRCO0FBM0RELFdBQU8sZ0JBQWdCO0lBQUNBLElBQUFBLEdBQUdBLENBMkQxQkE7SUEzRHVCQSxXQUFBQSxHQUFHQTtRQUFDc0IsSUFBQUEsT0FBT0EsQ0EyRGxDQTtRQTNEMkJBLFdBQUFBLE9BQU9BO1lBQUNLLElBQUFBLE9BQU9BLENBMkQxQ0E7WUEzRG1DQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtnQkFHekNLO29CQUlJQyxvQkFBWUEsT0FBaUJBLEVBQVVBLEtBQTJCQSxFQUFFQSxZQUFpQkEsRUFBRUEsTUFBV0EsRUFBRUEsU0FBa0NBO3dCQUoxSUMsaUJBcURDQTt3QkFqRDBDQSxVQUFLQSxHQUFMQSxLQUFLQSxDQUFzQkE7d0JBQzlEQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQTs0QkFDWEEsU0FBU0EsRUFBRUEsS0FBS0E7NEJBQ2hCQSxTQUFTQSxFQUFFQSxLQUFLQTs0QkFDaEJBLFlBQVlBLEVBQUVBLEtBQUtBOzRCQUNuQkEsUUFBUUEsRUFBRUEsS0FBS0E7NEJBQ2ZBLGtCQUFrQkEsRUFBRUEsR0FBR0E7eUJBQzFCQSxDQUFDQTt3QkFDRkEsSUFBSUEsT0FBT0EsR0FBR0EsUUFBUUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0E7d0JBQzFFQSxNQUFNQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTt3QkFDbkJBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBO3dCQUNuQkEsTUFBTUEsQ0FBQ0EsT0FBT0EsR0FBR0E7NEJBQ2JBLFNBQVNBLEVBQUVBLEtBQUtBOzRCQUNoQkEsU0FBU0EsRUFBRUEsS0FBS0E7NEJBQ2hCQSxZQUFZQSxFQUFFQSxLQUFLQTs0QkFDbkJBLFFBQVFBLEVBQUVBLEtBQUtBOzRCQUNmQSxrQkFBa0JBLEVBQUVBLEdBQUdBO3lCQUMxQkEsQ0FBQ0E7d0JBRUZBLDZEQUE2REE7d0JBQzdEQSxTQUFTQSxDQUFDQTs0QkFDTixnQkFBZ0IsRUFBRSxDQUFDO3dCQUN2QixDQUFDLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO3dCQUVUQSx3QkFBd0JBLElBQVFBOzRCQUM1QkMsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsUUFBUUEsR0FBR0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7NEJBQ3JEQSxJQUFJQSxDQUFDQSxHQUFHQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTs0QkFDMUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO3dCQUN6Q0EsQ0FBQ0E7d0JBQ0REOzRCQUNJRSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDeEJBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUN2Q0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQzdDQSxDQUFDQTs0QkFFREEsT0FBT0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0NBQ3JDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtnQ0FDdkJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUN4REEsQ0FBQ0E7d0JBQ0xBLENBQUNBO3dCQUNERixPQUFPQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFBQSxDQUFDQTs0QkFDekJBLElBQUlBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEVBQUVBLFVBQUFBLENBQUNBLElBQUlBLE9BQUFBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLFlBQVlBLENBQUNBLFFBQVFBLEVBQTdCQSxDQUE2QkEsQ0FBQ0EsQ0FBQ0E7NEJBQzNEQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUE2QkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQUEsSUFBSUE7Z0NBQ3hFQSxLQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQTs0QkFDM0JBLENBQUNBLENBQUNBLENBQUNBO3dCQUNQQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0E7b0JBakRNRCxrQkFBT0EsR0FBR0EsQ0FBQ0EsU0FBU0EsRUFBRUEsT0FBT0EsRUFBRUEsY0FBY0EsRUFBRUEsUUFBUUEsRUFBRUEsV0FBV0EsQ0FBQ0EsQ0FBQ0E7b0JBb0RqRkEsaUJBQUNBO2dCQUFEQSxDQXJEQUQsQUFxRENDLElBQUFEO2dCQUVEQSxPQUFHQSxDQUFDQSxVQUFVQSxDQUFDQSx1REFBdURBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO1lBQ3hGQSxDQUFDQSxFQTNEbUNMLE9BQU9BLEdBQVBBLGVBQU9BLEtBQVBBLGVBQU9BLFFBMkQxQ0E7UUFBREEsQ0FBQ0EsRUEzRDJCTCxPQUFPQSxHQUFQQSxXQUFPQSxLQUFQQSxXQUFPQSxRQTJEbENBO0lBQURBLENBQUNBLEVBM0R1QnRCLEdBQUdBLEdBQUhBLG9CQUFHQSxLQUFIQSxvQkFBR0EsUUEyRDFCQTtBQUFEQSxDQUFDQSxFQTNETSxnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBMkR0QiIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubW9kdWxlIFR5cGVzY3JpcHRCdWlsZGVyIHtcclxuXHRleHBvcnQgaW50ZXJmYWNlIElEaWN0aW9uYXJ5U3RyaW5nPFRWYWx1ZT5cclxuXHR7XHJcblx0XHRba2V5OiBzdHJpbmddOiBUVmFsdWU7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUgSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycyB7XHJcblx0ZXhwb3J0IGNsYXNzIEdldERldmljZVJlc3BvbnNlIHtcclxuXHRcdHB1YmxpYyBkZXZpY2U6SG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycy5EZXZpY2VEdG87XHJcblx0fVxyXG5cdGV4cG9ydCBjbGFzcyBEZXZpY2VMaW5rcyB7XHJcblx0XHRwdWJsaWMgc2VsZjpzdHJpbmc7XHJcblx0XHRwdWJsaWMgdXNhZ2VSZXBvcnQ6c3RyaW5nO1xyXG5cdH1cclxuXHRleHBvcnQgY2xhc3MgR2V0RGV2aWNlc1Jlc3BvbnNlIHtcclxuXHRcdHB1YmxpYyBkZXZpY2VzOkFycmF5PEhvdXNlT2ZUaGVGdXR1cmUuQXBpLkhvc3QuQ29udHJvbGxlcnMuRGV2aWNlRHRvPjtcclxuXHRcdHB1YmxpYyBsaW5rczpIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLkdldERldmljZXNMaW5rcztcclxuXHR9XHJcblx0ZXhwb3J0IGNsYXNzIEdldERldmljZXNMaW5rcyB7XHJcblx0XHRwdWJsaWMgc3luYzpzdHJpbmc7XHJcblx0fVxyXG5cdGV4cG9ydCBjbGFzcyBEZXZpY2VEdG8ge1xyXG5cdFx0cHVibGljIGlkOnN0cmluZztcclxuXHRcdHB1YmxpYyBkZXNjcmlwdGlvbjpzdHJpbmc7XHJcblx0XHRwdWJsaWMgbGlua3M6SG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycy5EZXZpY2VMaW5rcztcclxuXHR9XHJcblx0ZXhwb3J0IGNsYXNzIEdldFNlbnNvcnNSZXNwb25zZSB7XHJcblx0XHRwdWJsaWMgc2Vuc29yczpBcnJheTxIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzLlNlbnNvckR0bz47XHJcblx0fVxyXG5cdGV4cG9ydCBjbGFzcyBTZW5zb3JEdG8ge1xyXG5cdFx0cHVibGljIGlkOnN0cmluZztcclxuXHRcdHB1YmxpYyBkZXNjcmlwdGlvbjpzdHJpbmc7XHJcblx0fVxyXG5cdGV4cG9ydCBjbGFzcyBTZXJ2aWNlTG9jYXRpb25zIHtcclxuXHRcdHB1YmxpYyBkZXZpY2VzOnN0cmluZztcclxuXHRcdHB1YmxpYyByZWdpc3RlckRldmljZTpzdHJpbmc7XHJcblx0fVxyXG5cdGV4cG9ydCBjbGFzcyBHZXRSZXBvcnRkYXRhUmVzcG9uc2Uge1xyXG5cdFx0cHVibGljIHNlbnNvcnM6QXJyYXk8c3RyaW5nPjtcclxuXHRcdHB1YmxpYyBsYWJlbHM6QXJyYXk8c3RyaW5nPjtcclxuXHRcdHB1YmxpYyBkYXRhOkFycmF5PEFycmF5PG51bWJlcj4+O1xyXG5cdH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxubW9kdWxlIEhvdXNlT2ZUaGVGdXR1cmUuV2ViIHtcclxuICAgIGltcG9ydCB0ZXN0ID0gSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycztcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTZXJ2aWNlTG9jYXRpb25zIGV4dGVuZHMgYW5ndWxhci5JUHJvbWlzZTx0ZXN0LlNlcnZpY2VMb2NhdGlvbnM+IHtcclxuICAgIH1cclxuXHJcbiAgICBkZWNsYXJlIHZhciBhbmd1bGFyOiBhbmd1bGFyLklBbmd1bGFyU3RhdGljO1xyXG4gICAgZXhwb3J0IHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcIkhvdXNlT2ZUaGVGdXR1cmVcIiwgW1widWkucm91dGVyXCIsIFwiY2hhcnQuanNcIiwgXCJTaWduYWxSXCJdKTtcclxuICAgIGV4cG9ydCB2YXIgcm9vdCA9IFwiYXBwL1wiO1xyXG4gICAgJCgoKSA9PiB7XHJcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKFwiPGRpdiB1aS12aWV3PjwvZGl2PlwiKTtcclxuICAgICAgICAkKFwidGl0bGVcIikuaHRtbChcInt7dGl0bGV9fVwiKTtcclxuICAgICAgICBhbmd1bGFyLmJvb3RzdHJhcCgkKFwiaHRtbFwiKSwgW1wiSG91c2VPZlRoZUZ1dHVyZVwiXSwge3N0cmljdERpOnRydWV9KTtcclxuICAgIH0pO1xyXG4gICAgYXBwLmZhY3RvcnkoXCJzZXJ2aWNlTG9jYXRpb25zXCIsIFtcIiRodHRwXCIsICgkaHR0cDogYW5ndWxhci5JSHR0cFNlcnZpY2UpID0+ICRodHRwLmdldDx0ZXN0LlNlcnZpY2VMb2NhdGlvbnM+KFwiYXBpXCIpLnRoZW4oeCA9PiB4LmRhdGEpXSk7XHJcbiAgICBhcHAucnVuKFtcIiRyb290U2NvcGVcIiwgKCRyb290U2NvcGU6IGFueSkgPT4gJHJvb3RTY29wZS50aXRsZSA9IFwiSG91c2Ugb2YgdGhlIEZ1dHVyZVwiXSk7XHJcbn0iLCJtb2R1bGUgSG91c2VPZlRoZUZ1dHVyZS5XZWIge1xyXG4gICAgY2xhc3MgQ29uZmlndXJlIHtcclxuICAgICAgICBzdGF0aWMgJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJHVybFJvdXRlclByb3ZpZGVyXCIsIFwiJGxvY2F0aW9uUHJvdmlkZXJcIl07XHJcbiAgICAgICAgY29uc3RydWN0b3IoJHN0YXRlUHJvdmlkZXI6YW5ndWxhci51aS5JU3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyOmFuZ3VsYXIudWkuSVVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcjphbmd1bGFyLklMb2NhdGlvblByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgICAgICAuc3RhdGUoXCJSb290XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiByb290ICsgXCJsYXlvdXQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnN0YXRlKFwiUm9vdC5EYXNoYm9hcmRcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJkYXNoYm9hcmRcIlxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5zdGF0ZShcIlJvb3QuRGV2aWNlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcImRldmljZXNcIixcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcm9vdCArIFwiZGV2aWNlcy9pbmRleC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJIb3VzZU9mVGhlRnV0dXJlLldlYi5EZXZpY2VzLk92ZXJ2aWV3Q29udHJvbGxlciBhcyBjdHJsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZTogRGV2aWNlcy5Db250cm9sbGVyLnJlc29sdmVcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuc3RhdGUoXCJSb290LkRldmljZXMuRGV0YWlsc1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi86ZGV2aWNlSWRcIixcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogcm9vdCArIFwiZGV2aWNlcy9kZXRhaWxzL2luZGV4Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkRldmljZXMuRGV0YWlscy5EZXRhaWxDb250cm9sbGVyIGFzIGN0cmxcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXBwLmNvbmZpZyhDb25maWd1cmUpO1xyXG4gICAgICAgIGNsYXNzIENvbmZpZ3VyZURlYnVnIHtcclxuICAgICAgICAgICAgc3RhdGljICRpbmplY3QgPSBbXCIkcm9vdFNjb3BlXCIsIFwiJHN0YXRlXCJdO1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlICRyb290U2NvcGU6YW55LCBwcml2YXRlICRzdGF0ZTogYW5ndWxhci51aS5JU3RhdGVTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZUVycm9yXCIsIHRoaXMuc3RhdGVDaGFuZ2VFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIHRoaXMuc3RhdGVDaGFuZ2VTdGFydCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhdGVDaGFuZ2VFcnJvciA9IChldmVudDogYW55LCB0b1N0YXRlOiBhbnksIHRvUGFyYW1zOiBhbnksIGZyb21TdGF0ZTogYW55LCBmcm9tUGFyYW1zOiBhbnksIGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbmF2aWdhdGUgZnJvbSAnXCIgKyBKU09OLnN0cmluZ2lmeShmcm9tU3RhdGUpICsgXCInICgnXCIgKyBKU09OLnN0cmluZ2lmeShmcm9tUGFyYW1zKSArIFwiJykgdG8gJ1wiICsgSlNPTi5zdHJpbmdpZnkodG9TdGF0ZSkgKyBcIicgKCdcIiArIEpTT04uc3RyaW5naWZ5KHRvUGFyYW1zKSArIFwiJylcIixcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzdGF0ZUNoYW5nZVN0YXJ0ID0gKGV2ZW50OiBhbnksIHRvU3RhdGU6IGFueSwgdG9QYXJhbXM6IGFueSwgZnJvbVN0YXRlOiBhbnksIGZyb21QYXJhbXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwic3RhdGUgY2hhbmdlIHN0YXJ0OlxcclxcblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGBmcm9tOiAnJHtmcm9tU3RhdGUubmFtZX0nICgnJHtKU09OLnN0cmluZ2lmeShmcm9tUGFyYW1zKSB9JylcclxuYCxcclxuICAgICAgICAgICAgICAgICAgICBgdG86ICcke3RvU3RhdGUubmFtZX0nICgnJHtKU09OLnN0cmluZ2lmeSh0b1BhcmFtcykgfScpYCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFwcC5ydW4oQ29uZmlndXJlRGVidWcpO1xyXG4gICAgXHJcbn0iLCIvLy8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9hcHAudHNcIiAvPlxyXG4vL21vZHVsZSBIb3VzZU9mVGhlRnV0dXJlLldlYi5BdXRoIHtcclxuLy8gICAgaW1wb3J0IHRlc3QgPSBIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzO1xyXG4vLyAgICBjbGFzcyBMb2dpbkNvbnRyb2xsZXIge1xyXG4vLyAgICAgICAgdXNlcm5hbWU6IHN0cmluZztcclxuLy8gICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XHJcbi8vICAgICAgICBzdWJtaXQgPSAoKSA9PiB7XHJcbi8vICAgICAgICAgICAgdGhpcy4kaHR0cCh7XHJcbi8vICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbi8vICAgICAgICAgICAgICAgIHVybDogXCJhY2NvdW50L3Rva2VuXCIsXHJcbi8vICAgICAgICAgICAgICAgIGRhdGE6ICQucGFyYW0oe1xyXG4vLyAgICAgICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogXCJwYXNzd29yZFwiLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IHRoaXMudXNlcm5hbWUsXHJcbi8vICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZFxyXG4vLyAgICAgICAgICAgICAgICB9KSxcclxuLy8gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIiB9XHJcbi8vICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICB9XHJcbi8vICAgIH1cclxuLy8gICAgYXBwLmNvbnRyb2xsZXIoXCJMb2dpbkNvbnRyb2xsZXJcIiwgTG9naW5Db250cm9sbGVyKTtcclxuLy99IiwibW9kdWxlIEhvdXNlT2ZUaGVGdXR1cmUuV2ViLkRldmljZXMge1xyXG4gICAgaW1wb3J0IHRlc3QgPSBIb3VzZU9mVGhlRnV0dXJlLkFwaS5Ib3N0LkNvbnRyb2xsZXJzO1xyXG4gICAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIge1xyXG4gICAgICAgIHN0YXRpYyAkaW5qZWN0ID0gW1wiZGV2aWNlc1wiLCBcIiRodHRwXCJdO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZGV2aWNlczogSURldmljZXMsIHByaXZhdGUgJGh0dHA6YW5ndWxhci5JSHR0cFNlcnZpY2UpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3luYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4kaHR0cC5wb3N0KHRoaXMuZGV2aWNlcy5zeW5jVXJsLCB7fSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHggPT4gdGhpcy5kZXZpY2VzLnJlZnJlc2goKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSA9IChodWI6IHRlc3QuRGV2aWNlRHRvKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuJGh0dHAuZGVsZXRlKGh1Yi5saW5rcy5zZWxmKS50aGVuKHggPT4gdGhpcy5kZXZpY2VzLnJlZnJlc2goKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgcmVzb2x2ZTp7W2tleTpzdHJpbmddOmFueX0gPSB7XHJcbiAgICAgICAgICAgICAgICAnZGV2aWNlcyc6IFtcIiRodHRwXCIsIFwic2VydmljZUxvY2F0aW9uc1wiLCAoJGh0dHA6IGFuZ3VsYXIuSUh0dHBTZXJ2aWNlLCBzZXJ2aWNlTG9jYXRpb25zOiBJU2VydmljZUxvY2F0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHRzID0gPElEZXZpY2VzPnt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucmVmcmVzaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHNlcnZpY2VMb2NhdGlvbnMudGhlbih4ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQ8dGVzdC5HZXREZXZpY2VzUmVzcG9uc2U+KHguZGV2aWNlcykudGhlbih5ID0+IHkuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLmRldmljZXNQcm9taXNlID0gcmVzdWx0LnRoZW4oeCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLmRldmljZXMgPSB4LmRldmljZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geC5kZXZpY2VzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5zeW5jVXJsUHJvbWlzZSA9IHJlc3VsdC50aGVuKHggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5zeW5jVXJsID0geC5saW5rcy5zeW5jO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHgubGlua3Muc3luYztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8SURldmljZXM+cmVzdWx0cztcclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSURldmljZXMge1xyXG4gICAgICAgIHJlZnJlc2goKTp2b2lkO1xyXG4gICAgICAgIGRldmljZXNQcm9taXNlOiBhbmd1bGFyLklQcm9taXNlPHRlc3QuRGV2aWNlRHRvW10+O1xyXG4gICAgICAgIHN5bmNVcmxQcm9taXNlOiBhbmd1bGFyLklQcm9taXNlPHN0cmluZz47XHJcbiAgICAgICAgZGV2aWNlczogSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycy5EZXZpY2VEdG9bXTtcclxuICAgICAgICBzeW5jVXJsOiBzdHJpbmc7XHJcbiAgICB9XHJcbiAgICBhcHAuY29udHJvbGxlcihcIkhvdXNlT2ZUaGVGdXR1cmUuV2ViLkRldmljZXMuT3ZlcnZpZXdDb250cm9sbGVyXCIsIENvbnRyb2xsZXIpO1xyXG59IiwibW9kdWxlIEhvdXNlT2ZUaGVGdXR1cmUuV2ViIHtcclxuICAgIGNsYXNzIEh1YkNsaWVudCBcclxuICAgIHtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IGFuZ3VsYXIuSVJvb3RTY29wZVNlcnZpY2UpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlbGxvV29ybGQgPSAodGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG9Xb3JsZDogXCIgKyB0ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGFzcyBDb25maWd1cmUge1xyXG4gICAgICAgIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIkh1YlwiXTtcclxuICAgICAgICBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlIDogYW5ndWxhci5JUm9vdFNjb3BlU2VydmljZSxodWJDbGFzczogbmdTaWduYWxyLkh1YkZhY3RvcnkpIHtcclxuICAgICAgICAgICAgdmFyIGh1YiA9IG5ldyBodWJDbGFzcyhcIm1haW5cIiwge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzOiA8YW55Pm5ldyBIdWJDbGllbnQoJHJvb3RTY29wZSksXHJcbiAgICAgICAgICAgICAgICByb290UGF0aDogXCJzaWduYWxyXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGh1Yi5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXBwLnJ1bihDb25maWd1cmUpO1xyXG59IFxyXG4iLCJtb2R1bGUgSG91c2VPZlRoZUZ1dHVyZS5XZWIuRGV2aWNlcy5EZXRhaWxzIHtcclxuICAgIGltcG9ydCB0ZXN0ID0gSG91c2VPZlRoZUZ1dHVyZS5BcGkuSG9zdC5Db250cm9sbGVycztcclxuXHJcbiAgICBjbGFzcyBDb250cm9sbGVyIHtcclxuICAgICAgICBzdGF0aWMgJGluamVjdCA9IFtcImRldmljZXNcIiwgXCIkaHR0cFwiLCBcIiRzdGF0ZVBhcmFtc1wiLCBcIiRzY29wZVwiLCBcIiRpbnRlcnZhbFwiXTtcclxuICAgICAgICBvcHRpb25zOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGRldmljZXM6IElEZXZpY2VzLCBwcml2YXRlICRodHRwOiBhbmd1bGFyLklIdHRwU2VydmljZSwgJHN0YXRlUGFyYW1zOiBhbnksICRzY29wZTogYW55LCAkaW50ZXJ2YWw6YW5ndWxhci5JSW50ZXJ2YWxTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzaG93U2NhbGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2hvd1Rvb2x0aXBzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBvaW50RG90OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRhdGFzZXRTdHJva2VXaWR0aDogMC41XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBtYXhpbXVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpLmNsaWVudFdpZHRoIC8gMiB8fCAzMDA7XHJcbiAgICAgICAgICAgICRzY29wZS5kYXRhID0gW1tdXTtcclxuICAgICAgICAgICAgJHNjb3BlLmxhYmVscyA9IFtdO1xyXG4gICAgICAgICAgICAkc2NvcGUub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzaG93U2NhbGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2hvd1Rvb2x0aXBzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBvaW50RG90OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRhdGFzZXRTdHJva2VXaWR0aDogMC41XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGRhdGFzZXQgYXQgMjVGUFMgZm9yIGEgc21vb3RobHktYW5pbWF0aW5nIGNoYXJ0XHJcbiAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBnZXRMaXZlQ2hhcnREYXRhKCk7XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UmFuZG9tVmFsdWUoZGF0YTphbnkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsID0gZGF0YS5sZW5ndGgsIHByZXZpb3VzID0gbCA/IGRhdGFbbCAtIDFdIDogNTA7XHJcbiAgICAgICAgICAgICAgICB2YXIgeSA9IHByZXZpb3VzICsgTWF0aC5yYW5kb20oKSAqIDEwIC0gNTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB5IDwgMCA/IDAgOiB5ID4gMTAwID8gMTAwIDogeTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRMaXZlQ2hhcnREYXRhKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5kYXRhWzBdLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5sYWJlbHMgPSAkc2NvcGUubGFiZWxzLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhWzBdID0gJHNjb3BlLmRhdGFbMF0uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCRzY29wZS5kYXRhWzBdLmxlbmd0aCA8IG1heGltdW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubGFiZWxzLnB1c2goJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhWzBdLnB1c2goZ2V0UmFuZG9tVmFsdWUoJHNjb3BlLmRhdGFbMF0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZXZpY2VzLmRldmljZXNQcm9taXNlLnRoZW4oeCA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGV2aWNlID0gXy5maW5kKHgsIHogPT4gei5pZCA9PSAkc3RhdGVQYXJhbXMuZGV2aWNlSWQpO1xyXG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0PHRlc3QuR2V0UmVwb3J0ZGF0YVJlc3BvbnNlPihkZXZpY2UubGlua3MudXNhZ2VSZXBvcnQpLnN1Y2Nlc3MoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXBvcnREYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcG9ydERhdGE6IEhvdXNlT2ZUaGVGdXR1cmUuQXBpLkhvc3QuQ29udHJvbGxlcnMuR2V0UmVwb3J0ZGF0YVJlc3BvbnNlO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcC5jb250cm9sbGVyKFwiSG91c2VPZlRoZUZ1dHVyZS5XZWIuRGV2aWNlcy5EZXRhaWxzLkRldGFpbENvbnRyb2xsZXJcIiwgQ29udHJvbGxlcik7XHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
