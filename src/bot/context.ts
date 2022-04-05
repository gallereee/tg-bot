import { Scenes } from "telegraf";
import { TCPRequestCommon, TCPRequestWithAccountId } from "@gallereee/pms";

export interface Context
	extends Scenes.SceneContext,
		TCPRequestCommon,
		TCPRequestWithAccountId {}

export interface WizardContext
	extends Scenes.WizardContext,
		TCPRequestCommon,
		TCPRequestWithAccountId {}
