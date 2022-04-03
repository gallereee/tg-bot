import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	Inject,
	LoggerService,
} from "@nestjs/common";
import { TCPRequestCommon } from "types";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
	) {}

	catch(exception: Error, host: ArgumentsHost) {
		const [ctx] = host.getArgs<[TCPRequestCommon]>();
		const requestId = ctx.requestId;

		this.logger.error({ error: exception, requestId });

		return `Произошла ошибка.\nПожалуйста, напишите разработчику: @bd_dm.\n\nRequestId: ${requestId}`;
	}
}
