import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UseFilters,
} from "@nestjs/common";
import { TelegrafExecutionContext } from "nestjs-telegraf";
import { Context } from "bot/context";
import { IAMAccountProviderType } from "IAM/dto";
import { IAMService } from "IAM/service";
import { nanoid } from "nanoid";
import { AllExceptionFilter } from "app/filters/exceptions";
import { isNull } from "lodash";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(@Inject(IAMService) private iamService: IAMService) {}

	@UseFilters(AllExceptionFilter)
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = TelegrafExecutionContext.create(context).getContext<Context>();

		const {
			from: { id: userId, username },
			chat: { id: chatId },
		} = ctx;

		ctx.requestId = nanoid();

		const account = await this.iamService.createAccount({
			requestId: ctx.requestId,
			providerType: IAMAccountProviderType.TELEGRAM_USER,
			data: {
				userId: userId.toString(),
				username,
				chatId: chatId.toString(),
			},
		});

		ctx.accountId = account.id;

		return !isNull(account);
	}
}
