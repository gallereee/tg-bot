import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TelegrafExecutionContext } from "nestjs-telegraf";
import { Context } from "bot/context";
import { isNull } from "lodash";
import { AccountProviderType, IAMService } from "@gallereee/iam";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly iamService: IAMService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = TelegrafExecutionContext.create(context).getContext<Context>();

		const {
			from: { id: userId },
		} = ctx;

		const account = await this.iamService.login({
			requestId: ctx.requestId,
			providerType: AccountProviderType.TELEGRAM_USER,
			externalAccountId: userId.toString(),
		});

		if (isNull(account)) {
			return false;
		}

		ctx.accountId = account.id;

		return true;
	}
}
