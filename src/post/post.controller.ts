import { Body, Controller, Logger, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from 'src/shared/dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
    private readonly logger = new Logger(PostController.name)
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createPost(@Req() req: any, @Body(ValidationPipe) postDTO: CreatePostDTO) {
        postDTO.user = {
            connect: {
                ID: parseInt(req.user['ID'])
            }
        }
        this.logger.log("Creating post::::", JSON.stringify(postDTO))
        return await this.postService.create(postDTO)
    }
}
