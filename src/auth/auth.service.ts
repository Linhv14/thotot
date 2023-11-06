import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDTO, LoginDTO } from 'shared/dto/auth.dto';
import { catchError, of } from 'rxjs';
import { kafkaResponseParser } from '../../shared/kafka/kafka.response'
import { KafkaTopicManager } from '../../shared/kafka/kafka.topic';
import { authTopicsToCreate } from '../../shared/kafka/topics/auth.topic';
import { JwtService } from '@nestjs/jwt';
import { getPayload } from '../../shared/helper';
import { IPayload } from '../../shared/interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async login(userDTO: LoginDTO) {
    const stream = new Promise((resolve, reject) => {
      this.authClient
        .send('auth.login', JSON.stringify(userDTO))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)
    if (response.hasOwnProperty('error')) {
      throw new HttpException(response.error, HttpStatus.UNAUTHORIZED)
    }

    const payload = getPayload(response)
    const tokens = await this._signJwtToken(payload)
    await this._updateRefreshToken(response.ID, tokens.refreshToken)
    return tokens
  }

  async register(userDTO: CreateUserDTO) {
    const stream = new Promise((resolve, reject) => {
      this.authClient
        .send('auth.register', JSON.stringify(userDTO))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)
    if (response.hasOwnProperty('error')) {
      throw new HttpException(response.error, HttpStatus.BAD_REQUEST)
    }

    const payload = getPayload(response)
    const tokens = await this._signJwtToken(payload)
    await this._updateRefreshToken(response.ID, tokens.refreshToken)
    return tokens
  }

  async refreshTokens(ID: number, refreshToken: string) {
    const stream = new Promise((resolve, rejects) => {
      this.authClient
        .send('auth.verify', JSON.stringify({ ID, refreshToken }))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)
    console.log(response)
    // if (!refreshTokenMatches) throw new HttpException("Access denied", HttpStatus.FORBIDDEN)
    // const tokens = await this._signJwtToken(getPayload(user));
    // await this._updateRefreshToken(user.ID, tokens.refreshToken);
    // return tokens;
  }

  private async _signJwtToken(payload: IPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        secret: this.configService.get('JWT_SECRET_KEY')
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_EXPIRESIN_REFRESH'),
        secret: this.configService.get('JWT_SECRETKEY_REFRESH')
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async _updateRefreshToken(ID: number, refreshToken: string) {
    this.authClient.emit('auth.update-token', JSON.stringify({ ID, refreshToken }))
  }

  async validate(ID: number) {
    const stream = new Promise((resolve, reject) => {
      this.authClient
        .send('auth.validate', JSON.stringify(ID))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)
    console.log(response)
    if (response.hasOwnProperty('error'))
      throw new HttpException(response.error, HttpStatus.UNAUTHORIZED)

    return response
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('auth.register')
    this.authClient.subscribeToResponseOf('auth.login')
    this.authClient.subscribeToResponseOf('auth.validate')
    this.authClient.subscribeToResponseOf('auth.verify')

    const topicManager = new KafkaTopicManager();
    topicManager.createTopics(authTopicsToCreate);
  }
}
