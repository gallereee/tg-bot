import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import config from "config";
import { TelegrafModule } from "nestjs-telegraf";
import { BotModule } from "bot/module";

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

@Module({
	imports: [ConfigModuleRoot, WinstonModuleRoot, TelegrafModuleRoot, BotModule],
})
export class AppModule {}
