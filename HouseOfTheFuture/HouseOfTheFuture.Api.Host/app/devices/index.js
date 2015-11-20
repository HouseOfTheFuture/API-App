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
//# sourceMappingURL=index.js.map