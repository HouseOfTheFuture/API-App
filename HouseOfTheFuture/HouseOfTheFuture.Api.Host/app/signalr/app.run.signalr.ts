module HouseOfTheFuture.Web {
    class HubClient 
    {
        constructor(private root: angular.IRootScopeService) {
        }

        helloWorld = (text: string) => {
            console.log("HelloWorld: " + text);
        }
    }
    class Configure {
        static $inject = ["$rootScope", "Hub"];
        constructor($rootScope : angular.IRootScopeService,hubClass: ngSignalr.HubFactory) {
            var hub = new hubClass("main", {
                listeners: <any>new HubClient($rootScope),
                rootPath: "signalr"
            });
            hub.connect();
        }
    }
    app.run(Configure);
} 
