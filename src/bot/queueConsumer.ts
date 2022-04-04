import { Process, Processor } from "@nestjs/bull";
import { BOT_QUEUE, BOT_QUEUE_CREATE_POST } from "bot/constants";
import { Job } from "bull";
import { UseFilters } from "@nestjs/common";
import { AllExceptionFilter } from "app/filters/exceptions";
import { BotQueueCreatePostData } from "bot/dto";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { getPhotosForPostsKey } from "bot/utils/getPhotosForPostsKey";
import { InjectBot } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { Context } from "bot/context";
import config from "config";
import { PMSService } from "@gallereee/pms";

@Processor(BOT_QUEUE)
@UseFilters(AllExceptionFilter)
export class BotQueueConsumer {
	constructor(
		private readonly pmsService: PMSService,
		@InjectBot() private readonly bot: Telegraf<Context>,
		@InjectRedis() private readonly redis: Redis
	) {}

	@Process(BOT_QUEUE_CREATE_POST)
	async createPost(job: Job<BotQueueCreatePostData>) {
		const {
			data: { post: postCreateData, jobId, chatId },
		} = job;

		await this.redis.del(getPhotosForPostsKey(jobId));

		const post = await this.pmsService.createPost(postCreateData);

		await this.bot.telegram.sendMessage(
			chatId,
			`Фото загружены. Ссылка: ${config().webHost}/posts/${
				post.id
			}\n\nВаша страница: ${config().webHost}/accounts/${
				postCreateData.accountId
			}`
		);

		return {};
	}
}
