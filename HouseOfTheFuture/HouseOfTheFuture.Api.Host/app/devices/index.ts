module HouseOfTheFuture.Web.Devices {
    import test = HouseOfTheFuture.Api.Host.Controllers;
    export class Controller {
        static $inject = ["devices", "$http"];
        constructor(private devices: IDevices, private $http:angular.IHttpService) {
        }
        sync = () => {
            this.$http.post(this.devices.syncUrl, {})
                .then(x => this.devices.refresh());
        }
        delete = (hub: test.DeviceDto) => {
            this.$http.delete(hub.links.self).then(x => this.devices.refresh());
        }

        static resolve:{[key:string]:any} = {
                'devices': ["$http", "serviceLocations", ($http: angular.IHttpService, serviceLocations: IServiceLocations) => {
                    var results = <IDevices>{};
                    results.refresh = () => {
                        var result = serviceLocations.then(x => {
                            return $http.get<test.GetDevicesResponse>(x.devices).then(y => y.data);
                        });
                        results.devicesPromise = result.then(x => {
                            results.devices = x.devices;
                            return x.devices;
                        });
                        results.syncUrlPromise = result.then(x => {
                            results.syncUrl = x.links.sync;
                            return x.links.sync;
                        });
                    }
                    results.refresh();
                    return <IDevices>results;
                }]
            }
    }
    export interface IDevices {
        refresh():void;
        devicesPromise: angular.IPromise<test.DeviceDto[]>;
        syncUrlPromise: angular.IPromise<string>;
        devices: HouseOfTheFuture.Api.Host.Controllers.DeviceDto[];
        syncUrl: string;
    }
    app.controller("HouseOfTheFuture.Web.Devices.OverviewController", Controller);
}