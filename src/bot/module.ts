import { Module } from "@nestjs/common";
import { BotUpdate } from "bot/update";
import { IAMModule } from "IAM/module";

@Module({
	providers: [BotUpdate],
	imports: [IAMModule],
})
export class BotModule {}
