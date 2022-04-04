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
		botAccessToken: process.env.BOT_ACCESS_TOKEN,
		redisUrl: process.env.REDIS_URL,
		webHost: process.env.WEB_HOST,
	};
};
