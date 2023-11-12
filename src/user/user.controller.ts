import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangeAvatarDTO, CraeteProfileDTO } from 'shared/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly uploadService: UploadService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Req() req: any) {
        const ID = req.user['ID'];
        return await this.userService.getProfile(parseInt(ID))
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('create-profile')
    async createProfile(@Req() req: any, @Body(ValidationPipe) userDTO: CraeteProfileDTO) {
        const ID = parseInt(req.user['ID']);
        userDTO.ID = ID
        return await this.userService.update(userDTO)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('change-avatar')
    @UseInterceptors(FileInterceptor('file'))
    async changeAvatar(
        @Req() req: any,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 150000 }), // bytes
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })
                ]
            })
        )
        file: Express.Multer.File
    ) {
        const ID = req.user['ID']
        const { avatar } = await this.userService.getProfile(parseInt(ID))
        const newAvatar = await this.uploadService.upload(file, ID);
        await this.uploadService.delete(ID, avatar)

        const userDTO: ChangeAvatarDTO = {
            ID: parseInt(ID),
            avatar: newAvatar
        }
        await this.userService.update(userDTO)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('delete-avatar')
    async delete(@Req() req: any, @Body(ValidationPipe) { key }: { key: string }) {
        await this.uploadService.delete(req.user['ID'], key)
    }

}
