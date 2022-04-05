import { Update, Start, Ctx, Command, Action } from "nestjs-telegraf";
import { Context } from "bot/context";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "app/guards/auth";
import { AllExceptionFilter } from "app/filters/exceptions";
import {
	BOT_ACTION_UPLOAD,
	BOT_WIZARD_START,
	BOT_WIZARD_UPLOAD,
} from "bot/constants";

@Update()
@UseFilters(AllExceptionFilter)
export class BotUpdate {
	@Start()
	async startCommand(@Ctx() ctx: Context) {
		await ctx.scene.enter(BOT_WIZARD_START);
	}

	@Command("upload")
	@Action(BOT_ACTION_UPLOAD)
	@UseGuards(AuthGuard)
	async uploadCommand(@Ctx() ctx: Context) {
		await ctx.scene.enter(BOT_WIZARD_UPLOAD);
	}
}
