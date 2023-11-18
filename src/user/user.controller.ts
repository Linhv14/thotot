import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangeAvatarDTO, CreateProfileDTO } from 'src/shared/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { RolesGuard } from 'src/shared/guards';
import { Roles } from 'src/shared/decorator/role.decorator';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly uploadService: UploadService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Req() req: any) {
        return await this.userService.getProfile(parseInt(req.user['ID']))
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('create-profile')
    createProfile(@Req() req: any, @Body(ValidationPipe) userDTO: CreateProfileDTO) {
        userDTO.ID = parseInt(req.user['ID']);
        return this.userService.update(userDTO)
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
        const ID = parseInt(req.user['ID'])
        const { avatar } = await this.userService.getProfile(ID)
        const newAvatar = await this.uploadService.upload(file, ID);
        await this.uploadService.delete(ID, avatar)

        const userDTO: ChangeAvatarDTO = {
            ID,
            avatar: newAvatar
        }
        return this.userService.update(userDTO)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('user')
    @Patch('become-worker')
    async changeRole(@Req() req: any) {
        const user = {
            ID: parseInt(req.user['ID']),
            role: 'worker'
        }
        return this.userService.update(user)
    }

}
