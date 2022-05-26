import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	Inject,
	LoggerService,
} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { TCPRequestCommon } from "@gallereee/pms";
import { isString } from "lodash";

const ERROR_TEXT = "Произошла ошибка";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
	) {}

	catch(exception: Error, host: ArgumentsHost) {
		try {
			const [ctx] = host.getArgs<[TCPRequestCommon]>();
			const { requestId } = ctx;

			this.logger.error({
				error: exception.toString(),
				stack: exception.stack.toString(),
				requestId,
			});

			// @ts-ignore
			if (exception.status === 403) {
				return "Пожалуйста, начни с команды /start, чтобы создать аккаунт";
			}

			if (isString(exception)) {
				return exception;
			}

			return `${ERROR_TEXT}\n\nRequestId: ${requestId}`;
		} catch (e) {
			this.logger.error({ error: e.toString() });
			return ERROR_TEXT;
		}
	}
}
