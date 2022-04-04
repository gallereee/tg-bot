import { Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { PMS_SERVICE } from "PMS/constants";
import config from "config";
import { PMSService } from "PMS/service";

@Module({
	providers: [
		{
			provide: PMS_SERVICE,
			useFactory: () => {
				return ClientProxyFactory.create({
					transport: Transport.TCP,
					options: {
						host: config().PMSService.host,
						port: config().PMSService.port,
					},
				});
			},
		},
		PMSService,
	],
	exports: [PMSService],
})
export class PMSModule {}
