import { Body, Controller, Post, Get, ValidationPipe, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from 'src/shared/dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDTO } from 'src/shared/dto/auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body(ValidationPipe) user: LoginDTO) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDTO) {
    return await this.authService.register(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Req() req: any) {
    const ID = parseInt(req.user['ID']);
    console.log("auth controller:::logout", ID)
    return await this.authService.logout(ID)
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  refreshTokens(@Req() req: any) {
    const ID = parseInt(req.user['sub']);
    const refreshToken = req.user['refreshToken'];
    console.log(ID)
    return this.authService.refreshTokens(ID, refreshToken);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(@Req() req: any, @Body(ValidationPipe) userDTO: ChangePasswordDTO) {
      userDTO.ID = parseInt(req.user['ID'])
      return await this.authService.changePassword(userDTO)
  }
}
