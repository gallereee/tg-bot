import { Chat } from "typegram";
import { CreatePostDto } from "@gallereee/pms";

interface BotQueueCreatePostData {
	post: CreatePostDto;
	jobId: string;
	chatId: Chat["id"];
}

export { BotQueueCreatePostData };
