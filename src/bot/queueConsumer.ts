import { Process, Processor } from "@nestjs/bull";
import {
	BOT_ACTION_UPLOAD_SET_DESCRIPTION,
	BOT_QUEUE,
	BOT_QUEUE_CREATE_POST,
} from "bot/constants";
import { Job } from "bull";
import { UseFilters } from "@nestjs/common";
import { AllExceptionFilter } from "app/filters/exceptions";
import { BotQueueCreatePostData } from "bot/dto";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { getPhotosForPostsKey } from "bot/utils/getPhotosForPostsKey";
import { InjectBot } from "nestjs-telegraf";
import { Markup, Telegraf } from "telegraf";
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

		try {
			await this.redis.del(getPhotosForPostsKey(jobId));

			const post = await this.pmsService.createPost(postCreateData);
			const isPluralPhotos = postCreateData.photos.length > 1;

			const showPostWebAppParams = {
				for: "show-post",
				"post-id": post.id,
			};
			const showPostWebAppUrl = `${
				config().webHost
			}/auth/telegram/web-app/${encodeURIComponent(
				JSON.stringify(showPostWebAppParams)
			)}`;
			const showPostButton = {
				text: "Посмотреть",
				web_app: {
					url: showPostWebAppUrl,
				},
			};

			const myGallereeeWebAppParams = {
				for: "my-gallereee",
			};
			const myGallereeeWebAppUrl = `${
				config().webHost
			}/auth/telegram/web-app/${encodeURIComponent(
				JSON.stringify(myGallereeeWebAppParams)
			)}`;
			const myGallereeeButton = {
				text: "Моя галерея",
				web_app: {
					url: myGallereeeWebAppUrl,
				},
			};

			await this.bot.telegram.sendMessage(
				chatId,
				`Фото успешно ${isPluralPhotos ? "загружены" : "загружено"}`,
				Markup.inlineKeyboard([
					[showPostButton, myGallereeeButton],
					[
						{
							text: "Добавить описание",
							callback_data: `${BOT_ACTION_UPLOAD_SET_DESCRIPTION}/${post.id}`,
						},
					],
				])
			);
		} catch (e) {
			await this.bot.telegram.sendMessage(chatId, "Ошибка при загрузке фото");
		}

		return {};
	}
}
