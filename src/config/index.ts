export default () => {
	return {
		IAMService: {
			host: process.env.IAM_HOST,
			port: process.env.IAM_PORT,
		},
	};
};
