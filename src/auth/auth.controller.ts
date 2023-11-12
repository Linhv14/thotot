import { Body, Controller, Post, Get, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginDTO } from '../../shared/dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body(ValidationPipe) user: LoginDTO) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body(ValidationPipe) user: CreateUserDTO) {
    return await this.authService.register(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Req() req: any) {
    const ID = req.user['ID'];
    console.log("auth controller:::logout", ID)
    return await this.authService.logout(ID)
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  refreshTokens(@Req() req: any) {
    const ID = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    console.log(ID)
    return this.authService.refreshTokens(ID, refreshToken);
  }
  

  profile(@Req() req: any) {
    const ID = req.user['ID'];
    console.log(ID)
    return "My profile: " + ID
  }
}
