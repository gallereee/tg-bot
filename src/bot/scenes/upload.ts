import {
	Wizard,
	WizardStep,
	Context,
	Hears,
	On,
	Action,
} from "nestjs-telegraf";
import {
	BOT_ACTION_UPLOAD_SET_DESCRIPTION,
	BOT_QUEUE,
	BOT_QUEUE_CREATE_POST,
	BOT_QUEUE_CREATE_POST_DELAY,
	BOT_WIZARD_UPLOAD,
} from "bot/constants";
import { Markup } from "telegraf";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AllExceptionFilter } from "app/filters/exceptions";
import { Message } from "typegram";
import { isEmpty, isNull, isUndefined } from "lodash";
import { FileProvider, PMSService } from "@gallereee/pms";
import { getPhotosForPostsKey } from "bot/utils/getPhotosForPostsKey";
import { BotQueueCreatePostData } from "bot/dto";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { AuthGuard } from "app/guards/auth";
import { WizardContext } from "bot/context";

const HEARS_FINISH = "Завершить";

@Wizard(BOT_WIZARD_UPLOAD)
@UseGuards(AuthGuard)
@UseFilters(AllExceptionFilter)
export class UploadWizard {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		private readonly pmsService: PMSService,
		@InjectQueue(BOT_QUEUE)
		private readonly botQueue: Queue<BotQueueCreatePostData>
	) {}

	@Hears(HEARS_FINISH)
	async onCancel(@Context() ctx: WizardContext) {
		await ctx.reply("Загрузка фото завершена", Markup.removeKeyboard());

		ctx.scene.leave();
	}

	@WizardStep(1)
	async step1(@Context() ctx: WizardContext) {
		await ctx.reply("Отправь одно или несколько фото для загрузки");

		ctx.wizard.next();
	}

	@On("photo")
	@WizardStep(2)
	async step2(@Context() ctx: WizardContext) {
		const { accountId, requestId } = ctx;
		const {
			chat: { id: chatId },
		} = ctx;
		const message = ctx.message as Message.PhotoMessage;
		const photos = message.photo;
		const jobId = message.media_group_id;

		if (isUndefined(photos) || isEmpty(photos)) {
			return;
		}

		const largestPhoto = photos[photos.length - 1];
		const photo = {
			order: message.message_id,
			width: largestPhoto.width,
			height: largestPhoto.height,
			file: {
				provider: FileProvider.TELEGRAM,
				data: { fileId: largestPhoto.file_id },
			},
		};

		// Save photo to temporary redis storage
		await this.redis.lpush(getPhotosForPostsKey(jobId), JSON.stringify(photo));

		const photosRecords = await this.redis.lrange(
			getPhotosForPostsKey(jobId),
			0,
			-1
		);

		const photosForPost: BotQueueCreatePostData["post"]["photos"] =
			photosRecords
				.map((photosRecord) => JSON.parse(photosRecord))
				.sort((a, b) => a.order - b.order);

		const existingJob = await this.botQueue.getJob(jobId);
		if (!isNull(existingJob) && !isUndefined(existingJob)) {
			await existingJob.remove();
		}

		const postCreateData: BotQueueCreatePostData = {
			jobId,
			chatId,
			post: {
				accountId,
				requestId,
				photos: photosForPost,
			},
		};

		await this.botQueue.add(BOT_QUEUE_CREATE_POST, postCreateData, {
			delay: BOT_QUEUE_CREATE_POST_DELAY,
			jobId,
		});
	}

	@Action(new RegExp(`^${BOT_ACTION_UPLOAD_SET_DESCRIPTION}/.*`))
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

	@WizardStep(3)
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
