import { Inject, Injectable } from "@nestjs/common";
import { PMS_CMD_POSTS_CREATE, PMS_SERVICE } from "PMS/constants";
import { ClientProxy } from "@nestjs/microservices";
import { PMSCreatePostDto, Post } from "PMS/dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class PMSService {
	constructor(@Inject(PMS_SERVICE) public PMS: ClientProxy) {}

	async createPost(data: PMSCreatePostDto): Promise<Post> {
		return firstValueFrom(
			this.PMS.send<Post, PMSCreatePostDto>({ cmd: PMS_CMD_POSTS_CREATE }, data)
		);
	}
}
