export default () => {
	return {
		IAMService: {
			host: process.env.IAM_HOST,
			port: parseInt(process.env.IAM_PORT, 10),
		},
		PMSService: {
			host: process.env.PMS_HOST,
			port: parseInt(process.env.PMS_PORT, 10),
		},
		bot: {
			usesWebhooks: process.env.BOT_USES_WEBHOOKS === "true",
			accessToken: process.env.BOT_ACCESS_TOKEN,
			domain: process.env.BOT_DOMAIN,
			port: parseInt(process.env.BOT_PORT ?? "0", 10),
		},
		queueRedisUrl: process.env.QUEUE_REDIS_URL,
		webHost: process.env.WEB_HOST,
	};
};
