import { Chat } from "typegram";
import { CreatePostRequestDto } from "@gallereee/pms";

interface BotQueueCreatePostData {
	post: CreatePostRequestDto;
	jobId: string;
	chatId: Chat["id"];
}

export { BotQueueCreatePostData };
