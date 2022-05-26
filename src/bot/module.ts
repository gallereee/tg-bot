import { Module } from "@nestjs/common";
import { BotUpdate } from "bot/update";
import { BullModule } from "@nestjs/bull";
import { BOT_QUEUE } from "bot/constants";
import { BotQueueConsumer } from "bot/queueConsumer";
import { StartWizard } from "bot/scenes/start";
import { SetDescriptionWizard } from "bot/scenes/setDescription";

@Module({
	providers: [BotUpdate, StartWizard, SetDescriptionWizard, BotQueueConsumer],
	imports: [
		BullModule.registerQueue({
			name: BOT_QUEUE,
		}),
	],
})
export class BotModule {}
