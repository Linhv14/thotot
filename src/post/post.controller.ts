import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    private readonly logger = new Logger(PostController.name)
    constructor(private readonly postService: PostService) {}

    @Post('create')
    async createPost(@Body(ValidationPipe) postDTO: any) {
        return await this.postService.create(postDTO)
    }
}
