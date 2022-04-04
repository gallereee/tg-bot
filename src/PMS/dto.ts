import { TCPRequestCommon, TCPRequestWithAccountId } from "types";

enum FileProvider {
	TELEGRAM = "TELEGRAM",
}

interface Post {
	id: string;
}

interface CreateFileTelegramData {
	fileId: string;
}

interface CreateFileTelegram {
	provider: FileProvider.TELEGRAM;
	data: CreateFileTelegramData;
}

type CreateFileDto = CreateFileTelegram;

interface CreatePostPhoto {
	width: number;
	height: number;
	file: CreateFileDto;
}

interface PMSCreatePostDto extends TCPRequestCommon, TCPRequestWithAccountId {
	photos: CreatePostPhoto[];
}

export type { PMSCreatePostDto, Post };
export { FileProvider };
