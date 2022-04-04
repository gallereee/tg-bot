import { Update, Start } from "nestjs-telegraf";
import { Context } from "bot/context";
import config from "config";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "app/guards/auth";
import { AllExceptionFilter } from "app/filters/exceptions";

@Update()
@UseGuards(AuthGuard)
@UseFilters(AllExceptionFilter)
export class BotUpdate {
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
}
