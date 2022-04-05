import { Module } from "@nestjs/common";
import { BotUpdate } from "bot/update";
import { BullModule } from "@nestjs/bull";
import { BOT_QUEUE } from "bot/constants";
import { BotQueueConsumer } from "bot/queueConsumer";
import { StartWizard } from "bot/scenes/start";

@Module({
	providers: [BotUpdate, StartWizard, BotQueueConsumer],
	imports: [
		BullModule.registerQueue({
			name: BOT_QUEUE,
		}),
	],
})
export class BotModule {}
