import { Context } from "bot/context";
import { nanoid } from "nanoid";

const contextMiddleware = (ctx: Context, next: () => Promise<void>) => {
	ctx.requestId = nanoid();
	next();
};

export { contextMiddleware };
