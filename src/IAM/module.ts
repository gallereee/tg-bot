import { Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { IAM_SERVICE } from "IAM/constants";
import config from "config";
import { IAMService } from "IAM/service";

@Module({
	providers: [
		{
			provide: IAM_SERVICE,
			useFactory: () => {
				return ClientProxyFactory.create({
					transport: Transport.TCP,
					options: {
						host: config().IAMService.host,
						port: config().IAMService.port,
					},
				});
			},
		},
		IAMService,
	],
	exports: [IAMService],
})
export class IAMModule {}
