/// <reference path="../typings/tsd.d.ts" />
module HouseOfTheFuture.Web {
    import test = HouseOfTheFuture.Api.Host.Controllers;

    export interface IServiceLocations extends angular.IPromise<test.ServiceLocations> {
    }

    declare var angular: angular.IAngularStatic;
    export var app = angular.module("HouseOfTheFuture", ["ui.router", "chart.js"]);
    export var root = "app/";
    $(() => {
        $("body").append("<div ui-view></div>");
        $("title").html("{{title}}");
        angular.bootstrap($("html"), ["HouseOfTheFuture"], {strictDi:true});
    });
    app.factory("serviceLocations", ["$http", ($http: angular.IHttpService) => $http.get<test.ServiceLocations>("api").then(x => x.data)]);
    app.run(["$rootScope", ($rootScope:any) => $rootScope.title = "House of the Future"]);
}