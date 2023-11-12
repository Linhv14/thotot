import { Body, Controller, Get, Param, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CraeteProfileDTO } from 'shared/dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Req() req: any) {
        const ID = req.user['ID'];
        return await this.userService.getProfile(parseInt(ID))
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create-profile')
    async createProfile(@Req() req: any, @Body(ValidationPipe) userDTO: CraeteProfileDTO) {
        const ID = parseInt(req.user['ID']);
        userDTO.ID = ID
        return await this.userService.createProfile(userDTO)
    }
}
