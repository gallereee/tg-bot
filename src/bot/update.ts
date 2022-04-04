import { Update, Start, On } from "nestjs-telegraf";
import { Context } from "bot/context";
import config from "config";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "app/guards/auth";
import { AllExceptionFilter } from "app/filters/exceptions";
import { PMSService } from "PMS/service";
import { FileProvider } from "PMS/dto";
import { Message } from "typegram";
import { isEmpty, isUndefined } from "lodash";

@Update()
@UseGuards(AuthGuard)
@UseFilters(AllExceptionFilter)
export class BotUpdate {
	constructor(private readonly pmsService: PMSService) {}

	@Start()
	async startCommand(ctx: Context) {
		const {
			// eslint-disable-next-line camelcase
			from: { first_name, last_name },
		} = ctx;

		await ctx.reply(
			// eslint-disable-next-line camelcase
			`Привет, ${first_name} ${last_name}!\n` +
				`С помощью этого бота ты сможешь загрузить свои фото в Gallereee! (${
					config().webHost
				})\n\n` +
				"Чтобы загрузить фото, отправь его боту.\n" +
				"Если загрузишь несколько фото сразу, они будут объединены в один пост."
		);
	}

	@On("photo")
	async onPhotoUpload(ctx: Context) {
		const { accountId, requestId } = ctx;
		const photos = (ctx.message as Message.PhotoMessage).photo;

		if (isUndefined(photos) || isEmpty(photos)) {
			return;
		}

		const largestPhoto = photos[photos.length - 1];

		await this.pmsService.createPost({
			accountId,
			requestId,
			photos: [
				{
					width: largestPhoto.width,
					height: largestPhoto.height,
					file: {
						provider: FileProvider.TELEGRAM,
						data: { fileId: largestPhoto.file_id },
					},
				},
			],
		});
	}
}
