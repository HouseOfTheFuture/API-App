
module TypescriptBuilder {
	export interface IDictionaryString<TValue>
	{
		[key: string]: TValue;
	}
}

module HouseOfTheFuture.Api.Host.Controllers {
	export class GetDeviceResponse {
		public device:HouseOfTheFuture.Api.Host.Controllers.DeviceDto;
	}
	export class DeviceLinks {
		public self:string;
		public usageReport:string;
	}
	export class GetDevicesResponse {
		public devices:Array<HouseOfTheFuture.Api.Host.Controllers.DeviceDto>;
		public links:HouseOfTheFuture.Api.Host.Controllers.GetDevicesLinks;
	}
	export class GetDevicesLinks {
		public sync:string;
	}
	export class DeviceDto {
		public id:string;
		public description:string;
		public links:HouseOfTheFuture.Api.Host.Controllers.DeviceLinks;
	}
	export class GetSensorsResponse {
		public sensors:Array<HouseOfTheFuture.Api.Host.Controllers.SensorDto>;
	}
	export class SensorDto {
		public id:string;
		public description:string;
	}
	export class ServiceLocations {
		public devices:string;
		public registerDevice:string;
	}
	export class GetReportdataResponse {
		public sensors:Array<string>;
		public labels:Array<string>;
		public data:Array<Array<number>>;
	}
}