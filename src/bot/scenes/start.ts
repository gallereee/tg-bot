import { Wizard, WizardStep, Context, On, Hears } from "nestjs-telegraf";
import { BOT_WIZARD_START, infoText } from "bot/constants";
import { UseFilters } from "@nestjs/common";
import { AllExceptionFilter } from "app/filters/exceptions";
import { Markup } from "telegraf";
import { Message } from "typegram";
import { isEmpty, isNull, isUndefined } from "lodash";
import { AccountProviderType, IAMService } from "@gallereee/iam";
import { WizardContext } from "bot/context";

const HEARS_CANCEL = "Отменить";

@Wizard(BOT_WIZARD_START)
@UseFilters(AllExceptionFilter)
export class StartWizard {
	constructor(private readonly iamService: IAMService) {}

	@Hears(HEARS_CANCEL)
	async onCancel(@Context() ctx: WizardContext) {
		await ctx.reply("Создание аккаунта отменено", Markup.removeKeyboard());

		ctx.scene.leave();
	}

	@WizardStep(1)
	async step1(@Context() ctx: WizardContext) {
		const {
			// eslint-disable-next-line camelcase
			from: {
				id: userId,
				first_name: firstName,
				last_name: lastName,
				username: telegramUsername,
			},
			requestId,
		} = ctx;

		const isUserExists = await this.iamService.isUserExists({
			externalAccountId: userId.toString(),
			requestId,
		});

		if (isUserExists) {
			await ctx.reply(
				`Привет, ${firstName}! Для получения информации о боте, используй /info`
			);

			ctx.scene.leave();
			return;
		}

		const hasTelegramUsername =
			!isUndefined(telegramUsername) && !isEmpty(telegramUsername);
		const isUsernameAvailable = hasTelegramUsername
			? await this.iamService.isUsernameAvailable({
					username: telegramUsername,
					requestId,
			  })
			: false;

		let userFullName = "";
		if (!isUndefined(firstName)) {
			userFullName += firstName;
		}
		if (!isUndefined(firstName) && !isUndefined(lastName)) {
			userFullName += " ";
		}
		if (!isUndefined(lastName)) {
			userFullName += lastName;
		}

		await ctx.replyWithMarkdownV2(`Привет, ${userFullName}\\!\n\n${infoText}`);

		const keyboard = [[HEARS_CANCEL]];
		if (isUsernameAvailable) {
			keyboard.unshift([telegramUsername]);
		}

		await ctx.reply(
			"Давай создадим тебе аккаунт.\n" +
				"Введи имя пользователя, которое хочешь использовать",
			Markup.keyboard(keyboard).oneTime().resize()
		);

		ctx.wizard.next();
	}

	@WizardStep(2)
	@On("text")
	async step2(@Context() ctx: WizardContext) {
		const message = ctx.message as Message.TextMessage;
		const desiredUsername = message.text;
		const {
			requestId,
			from: { id: userId },
			chat: { id: chatId },
		} = ctx;

		const isUsernameAvailable = await this.iamService.isUsernameAvailable({
			username: desiredUsername,
			requestId,
		});

		if (!isUsernameAvailable) {
			await ctx.reply("Это имя пользователя уже занято. Выбери другое");
			return;
		}

		const account = await this.iamService.signup({
			providerType: AccountProviderType.TELEGRAM_USER,
			requestId,
			data: {
				username: desiredUsername,
				externalAccountId: userId.toString(),
				chatId: chatId.toString(),
			},
		});

		if (isNull(account)) {
			await ctx.reply("Что-то пошло не так. Попробуй ещё раз");
			return;
		}

		await ctx.reply(
			`Имя пользователя ${desiredUsername} успешно выбрано!`,
			Markup.removeKeyboard()
		);
		await ctx.reply(
			"Теперь ты можешь загрузить одно или несколько фото в Gallereee. Для этого отправь их в чат"
		);
		ctx.scene.leave();
	}
}
