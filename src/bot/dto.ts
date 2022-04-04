import { PMSCreatePostDto } from "PMS/dto";
import { Chat } from "typegram";

interface BotQueueCreatePostData {
	post: PMSCreatePostDto;
	jobId: string;
	chatId: Chat["id"];
}

export { BotQueueCreatePostData };
