import { Account } from "IAM/dto";

interface TCPRequestCommon {
	requestId: string;
}

interface TCPRequestWithAccountId {
	accountId: Account["id"];
}

export { TCPRequestCommon, TCPRequestWithAccountId };
