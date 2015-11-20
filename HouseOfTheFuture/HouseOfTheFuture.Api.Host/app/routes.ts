module HouseOfTheFuture.Web {
    class Configure {
        static $inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
        constructor($stateProvider:angular.ui.IStateProvider, $urlRouterProvider:angular.ui.IUrlRouterProvider, $locationProvider:angular.ILocationProvider) {
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state("Root", {
                    url: "/",
                    templateUrl: root + "layout.html",
                    abstract: true
                })
                .state("Root.Devices", {
                    url: "",
                    templateUrl: root + "devices/index.html",
                    controller: "HouseOfTheFuture.Web.Devices.OverviewController as ctrl",
                    resolve: Devices.Controller.resolve
                })
                .state("Root.Devices.Details", {
                    url: ":deviceId",
                    templateUrl: root + "devices/details/index.html",
                    controller: "HouseOfTheFuture.Web.Devices.Details.DetailController as ctrl"
                });
        }
    }
    app.config(Configure);
        class ConfigureDebug {
            static $inject = ["$rootScope", "$state"];
            constructor(private $rootScope:any, private $state: angular.ui.IStateService) {
                $rootScope.$on("$stateChangeError", this.stateChangeError);
                $rootScope.$on("$stateChangeStart", this.stateChangeStart);
            }
            stateChangeError = (event: any, toState: any, toParams: any, fromState: any, fromParams: any, error: any) => {
                console.error("Failed to navigate from '" + JSON.stringify(fromState) + "' ('" + JSON.stringify(fromParams) + "') to '" + JSON.stringify(toState) + "' ('" + JSON.stringify(toParams) + "')",
                    error);
            };

            stateChangeStart = (event: any, toState: any, toParams: any, fromState: any, fromParams: any) => {
                console.info("state change start:\r\n",
                    `from: '${fromState.name}' ('${JSON.stringify(fromParams) }')
`,
                    `to: '${toState.name}' ('${JSON.stringify(toParams) }')`);
            };
        }
        app.run(ConfigureDebug);
    
}