import { Update, Ctx, Command, On, Action, Start } from "nestjs-telegraf";
import { Context } from "bot/context";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "app/guards/auth";
import { AllExceptionFilter } from "app/filters/exceptions";
import {
	BOT_ACTION_UPLOAD_SET_DESCRIPTION,
	BOT_QUEUE,
	BOT_QUEUE_CREATE_POST,
	BOT_QUEUE_CREATE_POST_DELAY,
	BOT_WIZARD_SET_DESCRIPTION,
	BOT_WIZARD_START,
	infoText,
} from "bot/constants";
import { Markup } from "telegraf";
import { Message } from "typegram";
import { isEmpty, isNull, isUndefined } from "lodash";
import { FileProvider } from "@gallereee/pms";
import { getPhotosForPostsKey } from "bot/utils/getPhotosForPostsKey";
import { BotQueueCreatePostData } from "bot/dto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { getWebAppUrl } from "bot/utils/getWebAppUrl";

@Update()
@UseFilters(AllExceptionFilter)
export class BotUpdate {
	constructor(
		@InjectQueue(BOT_QUEUE)
		private readonly botQueue: Queue<BotQueueCreatePostData>,
		@InjectRedis() private readonly redis: Redis
	) {}

	@Start()
	async startCommand(@Ctx() ctx: Context) {
		await ctx.scene.enter(BOT_WIZARD_START);
	}

	@Command("info")
	async infoCommand(@Ctx() ctx: Context) {
		await ctx.replyWithMarkdownV2(infoText);
	}

	@On("photo")
	@UseGuards(AuthGuard)
	async uploadCommand(@Ctx() ctx: Context) {
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
	async setDescriptionCommand(@Ctx() ctx: Context) {
		await ctx.scene.enter(BOT_WIZARD_SET_DESCRIPTION);
	}

	@Command("menu")
	@UseGuards(AuthGuard)
	async menuCommand(@Ctx() ctx: Context) {
		await ctx.reply(
			"Меню",
			Markup.inlineKeyboard([
				[
					{
						text: "Моя галерея",
						web_app: {
							url: getWebAppUrl({ for: "my-gallereee" }),
						},
					},
				],
			])
		);
	}
}
