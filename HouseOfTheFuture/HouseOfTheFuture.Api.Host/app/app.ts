/// <reference path="../typings/tsd.d.ts" />
module HouseOfTheFuture.Web {
    import test = HouseOfTheFuture.Api.Host.Controllers;

    export interface IServiceLocations extends ng.IPromise<test.ServiceLocations> {
    }

    declare var angular: ng.IAngularStatic;
    export var app = angular.module("HouseOfTheFuture", ["ui.router"]);
    export var root = "app/";
    $(() => {
        angular.bootstrap($("html"), ["HouseOfTheFuture"], {strictDi:true});
    });
    app.factory("serviceLocations", ["$http", ($http: angular.IHttpService) => $http.get<test.ServiceLocations>("api").then(x => x.data)]);
}