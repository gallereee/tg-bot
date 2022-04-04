import { Scenes } from "telegraf";
import { TCPRequestCommon, TCPRequestWithAccountId } from "types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context
	extends Scenes.SceneContext,
		TCPRequestCommon,
		TCPRequestWithAccountId {}
