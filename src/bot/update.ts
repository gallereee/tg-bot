import { Update, Start, On, Ctx } from "nestjs-telegraf";
import { Context } from "bot/context";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "app/guards/auth";
import { AllExceptionFilter } from "app/filters/exceptions";
import { Message } from "typegram";
import { isEmpty, isNull, isUndefined } from "lodash";
import { InjectQueue } from "@nestjs/bull";
import {
	BOT_QUEUE,
	BOT_QUEUE_CREATE_POST,
	BOT_QUEUE_CREATE_POST_DELAY,
	BOT_WIZARD_START,
} from "bot/constants";
import { Queue } from "bull";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { BotQueueCreatePostData } from "bot/dto";
import { getPhotosForPostsKey } from "bot/utils/getPhotosForPostsKey";
import { FileProvider } from "@gallereee/pms";

@Update()
@UseFilters(AllExceptionFilter)
export class BotUpdate {
	constructor(
		@InjectRedis() private readonly redis: Redis,
		@InjectQueue(BOT_QUEUE)
		private readonly botQueue: Queue<BotQueueCreatePostData>
	) {}

	@Start()
	async startCommand(@Ctx() ctx: Context) {
		await ctx.scene.enter(BOT_WIZARD_START);
	}

	@On("photo")
	@UseGuards(AuthGuard)
	async onPhotoUpload(ctx: Context) {
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
			photosRecords.map((photosRecord) => JSON.parse(photosRecord));

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
}
