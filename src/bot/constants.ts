const BOT_QUEUE = "BOT_QUEUE";
const BOT_QUEUE_CREATE_POST = "BOT_QUEUE_CREATE_POST";
const BOT_QUEUE_CREATE_POST_DELAY = 2_000;
const BOT_PHOTOS_FOR_POSTS_KEY = "photosForPosts";

// Scenes
const BOT_WIZARD_START = "BOT_WIZARD_START";
const BOT_WIZARD_SET_DESCRIPTION = "BOT_WIZARD_SET_DESCRIPTION";

// Actions
const BOT_ACTION_UPLOAD_SET_DESCRIPTION = "setDescription";

// Texts
const infoText =
	"С помощью этого бота ты можешь загрузить свои фото в Gallereee\\.\n" +
	"\n" +
	"• *Для загрузки фото*: отправь одно или несколько фото в чат\n" +
	"\n" +
	"• *Для редактирования фото и управления аккаунтом*: перейди в меню /menu\n" +
	"\n" +
	"• *Для подписки на человека*: отправь его контакт боту";

export {
	infoText,
	BOT_QUEUE,
	BOT_QUEUE_CREATE_POST,
	BOT_QUEUE_CREATE_POST_DELAY,
	BOT_PHOTOS_FOR_POSTS_KEY,
	BOT_WIZARD_START,
	BOT_WIZARD_SET_DESCRIPTION,
	BOT_ACTION_UPLOAD_SET_DESCRIPTION,
};
