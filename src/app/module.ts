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
import { IAMModule } from "@gallereee/iam";
import { contextMiddleware } from "middleware/context";

const TelegrafSession = require("telegraf-session-redis");

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

const telegrafSession = new TelegrafSession({
	store: {
		url: config().queueRedisUrl,
	},
});

const TelegrafModuleRoot = TelegrafModule.forRoot({
	token: config().bot.accessToken,
	launchOptions: config().bot.usesWebhooks
		? {
				webhook: {
					domain: config().bot.domain,
					hookPath: `/${config().bot.accessToken}`,
				},
		  }
		: undefined,
	include: [BotModule],
	middlewares: [contextMiddleware, telegrafSession],
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

const IAMModuleRoot = IAMModule.register({
	host: config().IAMService.host,
	port: config().IAMService.port,
});

@Module({
	imports: [
		ConfigModuleRoot,
		WinstonModuleRoot,
		TelegrafModuleRoot,
		RedisModuleRoot,
		BullModuleRoot,
		IAMModuleRoot,
		PMSModuleRoot,
		BotModule,
	],
})
export class AppModule {}
