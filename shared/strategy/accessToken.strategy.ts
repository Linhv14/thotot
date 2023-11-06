import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { catchError, of } from "rxjs";
import { IPayload } from "../interfaces/payload.interface";
import { kafkaResponseParser } from "../kafka/kafka.response";


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
        configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY')
        })
    }

    async validate(payload: IPayload) {
        const stream = new Promise((resolve, reject) => {
            this.authClient
              .send('auth.validate', JSON.stringify(payload.sub))
              .pipe(catchError(val => of({ error: val.message })))
              .subscribe(message => resolve(message))
          })
          const response = await kafkaResponseParser(stream)
          if (response.hasOwnProperty('error')) {
            throw new HttpException(response.error, HttpStatus.UNAUTHORIZED)
          }

        return response;
    }

}