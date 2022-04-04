import { Scenes } from "telegraf";
import { TCPRequestCommon, TCPRequestWithAccountId } from "@gallereee/pms";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context
	extends Scenes.SceneContext,
		TCPRequestCommon,
		TCPRequestWithAccountId {}
