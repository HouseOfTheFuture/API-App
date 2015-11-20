module HouseOfTheFuture.Web.Devices.Details {
    import test = HouseOfTheFuture.Api.Host.Controllers;
    class Controller {
        static $inject = ["devices", "$http", "$stateParams"];

        constructor(devices: IDevices, private $http: angular.IHttpService, $stateParams:any) {
            devices.devicesPromise.then(x => {
                var device = _.find(x, z => z.id == $stateParams.deviceId);
                $http.get<test.GetReportdataResponse>(device.links.usageReport).success(data => {
                    this.reportData = data;
                });
            });
        }

        reportData: HouseOfTheFuture.Api.Host.Controllers.GetReportdataResponse;
    }

    app.controller("HouseOfTheFuture.Web.Devices.Details.DetailController", Controller);
}