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
                var UsageNode = (function () {
                    function UsageNode() {
                    }
                    return UsageNode;
                })();
                Controllers.UsageNode = UsageNode;
                var SensorResults = (function () {
                    function SensorResults() {
                    }
                    return SensorResults;
                })();
                Controllers.SensorResults = SensorResults;
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
        Web.app = angular.module("HouseOfTheFuture", ["ui.router"]);
        Web.root = "app/";
        $(function () {
            angular.bootstrap($("html"), ["HouseOfTheFuture"], { strictDi: true });
        });
        Web.app.factory("serviceLocations", ["$http", function ($http) { return $http.get("api").then(function (x) { return x.data; }); }]);
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
                    .state("Root.Devices", {
                    url: "",
                    templateUrl: Web.root + "devices/index.html",
                    controller: "HouseOfTheFuture.Web.Devices.OverviewController as ctrl",
                    resolve: Web.Devices.Controller.resolve
                })
                    .state("Root.Devices.Details", {
                    url: ":deviceId",
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
                                serviceLocations.then(function (x) {
                                    var result = $http.get(x.devices).then(function (y) { return y.data; });
                                    results.devicesPromise = result.then(function (x) {
                                        results.devices = x.devices;
                                        return x.devices;
                                    });
                                    results.syncUrlPromise = result.then(function (x) {
                                        results.syncUrl = x.links.sync;
                                        return x.links.sync;
                                    });
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
        var Devices;
        (function (Devices) {
            var Details;
            (function (Details) {
                var Controller = (function () {
                    function Controller(devices, $http, $stateParams) {
                        var _this = this;
                        this.$http = $http;
                        devices.devicesPromise.then(function (x) {
                            var device = _.find(x, function (z) { return z.id == $stateParams.deviceId; });
                            $http.get(device.links.usageReport).success(function (data) {
                                _this.reportData = data;
                            });
                        });
                    }
                    Controller.$inject = ["devices", "$http", "$stateParams"];
                    return Controller;
                })();
                Web.app.controller("HouseOfTheFuture.Web.Devices.Details.DetailController", Controller);
            })(Details = Devices.Details || (Devices.Details = {}));
        })(Devices = Web.Devices || (Web.Devices = {}));
    })(Web = HouseOfTheFuture.Web || (HouseOfTheFuture.Web = {}));
})(HouseOfTheFuture || (HouseOfTheFuture = {}));
