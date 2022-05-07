import config from "config";

const getWebAppUrl = (params: any): string => {
	return `${config().webHost}/auth/telegram/web-app/${encodeURIComponent(
		JSON.stringify(params)
	)}`;
};

export { getWebAppUrl };
