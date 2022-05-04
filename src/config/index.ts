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
			webhookSecret: process.env.BOT_WEBHOOK_SECRET,
			domain: process.env.BOT_DOMAIN,
		},
		queueRedisUrl: process.env.QUEUE_REDIS_URL,
		webHost: process.env.WEB_HOST,
	};
};
