import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private authService: AuthService) { }
  canActivate(context: ExecutionContext): boolean {

    // Get list Role from @Role decorator
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // That's public URL
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization
    if (!authToken) { return false }
    const token = authToken.split(' ')[1];
    const decoded = this.authService.decode(token)
    console.log("Role guard matching::::", roles.includes(decoded['role']))

    return roles.includes(decoded['role']);
  }
}