import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	Inject,
	LoggerService,
} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { TCPRequestCommon } from "@gallereee/pms";

const ERROR_TEXT =
	"Произошла ошибка.\nПожалуйста, напишите разработчику: @bd_dm.";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
	) {}

	catch(exception: Error, host: ArgumentsHost) {
		try {
			const [ctx] = host.getArgs<[TCPRequestCommon]>();
			const { requestId } = ctx;

			this.logger.error({ error: exception, requestId });

			return `${ERROR_TEXT}\n\nRequestId: ${requestId}`;
		} catch (e) {
			return ERROR_TEXT;
		}
	}
}
