import { Module } from "@nestjs/common";
import { BotUpdate } from "bot/update";
import { IAMModule } from "IAM/module";
import { BullModule } from "@nestjs/bull";
import { BOT_QUEUE } from "bot/constants";
import { BotQueueConsumer } from "bot/queueConsumer";

@Module({
	providers: [BotUpdate, BotQueueConsumer],
	imports: [
		IAMModule,
		BullModule.registerQueue({
			name: BOT_QUEUE,
		}),
	],
})
export class BotModule {}
