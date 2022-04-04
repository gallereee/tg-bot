import { Inject, Injectable } from "@nestjs/common";
import { IAM_CMD_ACCOUNTS_CREATE, IAM_SERVICE } from "IAM/constants";
import { ClientProxy } from "@nestjs/microservices";
import { Account, IAMCreateTelegramUserAccountDto } from "IAM/dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class IAMService {
	constructor(@Inject(IAM_SERVICE) public IAM: ClientProxy) {}

	async createAccount(data: IAMCreateTelegramUserAccountDto): Promise<Account> {
		return firstValueFrom(
			this.IAM.send<Account, IAMCreateTelegramUserAccountDto>(
				{ cmd: IAM_CMD_ACCOUNTS_CREATE },
				data
			)
		);
	}
}
