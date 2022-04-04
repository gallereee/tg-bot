import { TCPRequestCommon } from "types";

interface Account {
	id: string;
}

enum IAMAccountProviderType {
	TELEGRAM_USER = "TELEGRAM_USER",
}

interface IAMCreateTelegramUserAccountData {
	chatId: string;
	username?: string;
	userId: string;
}

interface IAMCreateTelegramUserAccountDto extends TCPRequestCommon {
	providerType: IAMAccountProviderType.TELEGRAM_USER;
	data: IAMCreateTelegramUserAccountData;
}

export { IAMAccountProviderType };
export type { IAMCreateTelegramUserAccountDto, Account };
