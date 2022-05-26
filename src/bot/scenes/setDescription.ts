import { Wizard, WizardStep, Context, Hears, On } from "nestjs-telegraf";
import { BOT_QUEUE, BOT_WIZARD_SET_DESCRIPTION } from "bot/constants";
import { Markup } from "telegraf";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AllExceptionFilter } from "app/filters/exceptions";
import { Message } from "typegram";
import { PMSService } from "@gallereee/pms";
import { BotQueueCreatePostData } from "bot/dto";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { AuthGuard } from "app/guards/auth";
import { WizardContext } from "bot/context";

const HEARS_FINISH = "Завершить";

@Wizard(BOT_WIZARD_SET_DESCRIPTION)
@UseGuards(AuthGuard)
@UseFilters(AllExceptionFilter)
export class SetDescriptionWizard {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		private readonly pmsService: PMSService,
		@InjectQueue(BOT_QUEUE)
		private readonly botQueue: Queue<BotQueueCreatePostData>
	) {}

	@Hears(HEARS_FINISH)
	async onCancel(@Context() ctx: WizardContext) {
		await ctx.reply("Отменено", Markup.removeKeyboard());

		ctx.scene.leave();
	}

	@WizardStep(1)
	async setDescription(@Context() ctx: WizardContext) {
		const session = ctx.session as any;
		// @ts-ignore
		const actionName = ctx.match[0];
		[, session.postId] = actionName.split("/");

		await ctx.reply(
			"Напиши описание для твоих фото",
			Markup.keyboard([HEARS_FINISH]).oneTime().resize()
		);

		ctx.wizard.next();
	}

	@WizardStep(2)
	@On("text")
	async step3(@Context() ctx: WizardContext) {
		const { requestId } = ctx;
		const session = ctx.session as any;
		const message = ctx.message as Message.TextMessage;

		await this.pmsService.setPostDescription({
			postId: session.postId,
			description: message.text,
			requestId,
		});

		await ctx.reply(
			// @ts-ignore
			`Описание добавлено: ${message.text}`,
			Markup.removeKeyboard()
		);

		ctx.scene.leave();
	}
}
