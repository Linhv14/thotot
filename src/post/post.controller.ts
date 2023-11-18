import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from 'src/shared/dto';

@Controller('post')
export class PostController {
    private readonly logger = new Logger(PostController.name)
    constructor(private readonly postService: PostService) {}

    @Post('create')
    async createPost(@Body(ValidationPipe) postDTO: CreatePostDTO) {
        this.logger.log("Creating post::::", JSON.stringify(postDTO))
        return await this.postService.create(postDTO)
    }
}
