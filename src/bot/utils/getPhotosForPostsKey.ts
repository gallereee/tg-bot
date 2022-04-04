import { BOT_PHOTOS_FOR_POSTS_KEY } from "bot/constants";

const getPhotosForPostsKey = (jobId: string): string => {
	return `${BOT_PHOTOS_FOR_POSTS_KEY}:${jobId}`;
};

export { getPhotosForPostsKey };
