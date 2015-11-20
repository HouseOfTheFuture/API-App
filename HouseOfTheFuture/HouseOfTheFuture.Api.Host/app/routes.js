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
//# sourceMappingURL=routes.js.map