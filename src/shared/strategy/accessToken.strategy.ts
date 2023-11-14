import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { IPayload } from "../interfaces/payload.interface";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY')
        })
    }

    async validate(payload: IPayload) {
        return await this.authService.validate(payload.sub)
    }

}