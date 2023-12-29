import { Body, Controller, Delete, FileTypeValidator, ForbiddenException, Get, MaxFileSizeValidator, ParseFilePipe, Patch, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangeAvatarDTO, CoordinateDTO, CreateProfileDTO, DeleteUserDTO, OptionsDTO } from 'src/shared/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { RolesGuard } from 'src/shared/guards';
import { Roles } from 'src/shared/decorator/role.decorator';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { SkipThrottle, Throttle } from '@nestjs/throttler';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly uploadService: UploadService,
    ) { }

    // @UseInterceptors(CacheInterceptor)
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Req() req: any) {
        const ID = parseInt(req.user['ID'])
        return await this.userService.getProfile(ID)
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

    @UseGuards(AuthGuard('jwt'))
    @Patch('become-admin')
    async becomeAdmin(@Req() req: any) {
        const user = {
            ID: parseInt(req.user['ID']),
            role: 'admin'
        }
        return this.userService.update(user)
    }

    @Throttle({ default: { limit: 8, ttl: 6000 } }) // miliseconds
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Get('all')
    async getAllUsers(@Body(ValidationPipe) options: OptionsDTO) {
        return this.userService.getAll(options)
    }

    @Throttle({ default: { limit: 8, ttl: 6000 } }) // miliseconds
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Delete('delete')
    async deleteUser(@Body(ValidationPipe) userDTO: DeleteUserDTO, @Req() req: any) {

        if (userDTO.ID == req.user['ID']) {
            throw new ForbiddenException('Forbidden resource')
        }
        return this.userService.deleteUser(userDTO)
    }

    @Get('find-nearby')
    async findNearBy() {
        return this.userService.findNearBy()
    }

}
