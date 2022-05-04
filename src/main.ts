import { NestFactory } from "@nestjs/core";
import { AppModule } from "app/module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { getBotToken } from "nestjs-telegraf";
import config from "config";

async function bootstrapWebHookMode() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	const bot = app.get(getBotToken());
	app.use(bot.webhookCallback(`/${config().bot.webhookSecret}`));
}

async function bootstrapPollMode() {
	const app = await NestFactory.createApplicationContext(AppModule);
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
}

async function bootstrap() {
	if (config().bot.usesWebhooks) {
		await bootstrapWebHookMode();
	} else {
		await bootstrapPollMode();
	}
}

bootstrap();
