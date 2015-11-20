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
//# sourceMappingURL=index.js.map