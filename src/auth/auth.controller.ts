import { Body, Controller, Post, UseFilters, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginDTO } from 'shared/dto/auth.dto';

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
}
