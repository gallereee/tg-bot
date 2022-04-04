import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import config from "config";
import { TelegrafModule } from "nestjs-telegraf";
import { BotModule } from "bot/module";
import { BullModule } from "@nestjs/bull";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { PMSModule } from "@gallereee/pms";

const ConfigModuleRoot = ConfigModule.forRoot();

const WinstonModuleRoot = WinstonModule.forRoot({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	exitOnError: false,
	transports: [
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
		}),
		new winston.transports.File({ filename: "logs/combined.log" }),
	],
});

const TelegrafModuleRoot = TelegrafModule.forRoot({
	token: config().botAccessToken,
	include: [BotModule],
});

const BullModuleRoot = BullModule.forRoot({
	// @ts-ignore
	redis: config().queueRedisUrl,
});

const RedisModuleRoot = RedisModule.forRoot({
	config: { url: config().queueRedisUrl },
});

const PMSModuleRoot = PMSModule.register({
	host: config().PMSService.host,
	port: config().PMSService.port,
});

@Module({
	imports: [
		ConfigModuleRoot,
		WinstonModuleRoot,
		TelegrafModuleRoot,
		RedisModuleRoot,
		BullModuleRoot,
		PMSModuleRoot,
		BotModule,
	],
})
export class AppModule {}
