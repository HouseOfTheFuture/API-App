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
//# sourceMappingURL=app.js.map