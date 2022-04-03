import { NestFactory } from "@nestjs/core";
import { AppModule } from "app/module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);

	const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
	app.useLogger(logger);
}

bootstrap();
