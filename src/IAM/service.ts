import { Inject, Injectable } from "@nestjs/common";
import { IAM_SERVICE } from "IAM/constants";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class IAMService {
	constructor(@Inject(IAM_SERVICE) public IAM: ClientProxy) {}
}
