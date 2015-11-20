var HouseOfTheFuture;
(function (HouseOfTheFuture) {
    var Web;
    (function (Web) {
        var Devices;
        (function (Devices) {
            var Controller = (function () {
                function Controller(serviceLocations, $http) {
                    this.serviceLocations = serviceLocations;
                    this.$http = $http;
                    serviceLocations.then(function (x) { return x.devices; });
                }
                Controller.$inject = ["serviceLocations", "$http"];
                return Controller;
            })();
            Web.app.controller("HouseOfTheFuture.Web.Devices.OverviewController", Controller);
        })(Devices = Web.Devices || (Web.Devices = {}));
    })(Web = HouseOfTheFuture.Web || (HouseOfTheFuture.Web = {}));
})(HouseOfTheFuture || (HouseOfTheFuture = {}));
//# sourceMappingURL=devices.js.map