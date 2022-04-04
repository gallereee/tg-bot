import { Module } from "@nestjs/common";
import { BotUpdate } from "bot/update";
import { IAMModule } from "IAM/module";
import { PMSModule } from "PMS/module";

@Module({
	providers: [BotUpdate],
	imports: [IAMModule, PMSModule],
})
export class BotModule {}
