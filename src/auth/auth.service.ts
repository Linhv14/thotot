import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthDTO } from 'src/shared/dto/auth.dto';
import { catchError, of } from 'rxjs';
import { kafkaResponseParser } from 'src/shared/kafka/kafka.response'
import { authTopicsToCreate } from 'src/shared/kafka/topics/auth.topic';
import { JwtService } from '@nestjs/jwt';
import { getPayload } from 'src/shared/helper';
import { IPayload } from 'src/shared/interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
import { KafkaTopicManager } from 'src/shared/kafka/kafka.topic-manager';
import { ChangePasswordDTO } from 'src/shared/dto/auth.dto';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async login(userDTO: AuthDTO) {
    this.logger.log("Login:::")
    const user = await this._sendMessage('auth.login', userDTO, HttpStatus.UNAUTHORIZED)

    const tokens = await this._signJwtToken(getPayload(user))
    await this._updateRefreshToken(user.ID, tokens.refreshToken)
    return tokens
  }

  async register(userDTO: AuthDTO) {
    this.logger.log("Register:::")
    const user = await this._sendMessage('auth.register', userDTO, HttpStatus.BAD_REQUEST)
    return user
  }

  async logout(ID: number) {
    this.logger.log("Logout:::", ID)
    this.authClient.emit('auth.logout', JSON.stringify({ ID, refreshTokens: "" }))
  }

  async refreshTokens(ID: number, refreshToken: string) {
    const user = await this._sendMessage('auth.verify', {ID, refreshToken}, HttpStatus.FORBIDDEN)

    const tokens = await this._signJwtToken(getPayload(user));
    await this._updateRefreshToken(user.ID, tokens.refreshToken);
    return tokens;
  }

  async changePassword(userDTO: ChangePasswordDTO) {
    this.logger.log("Changing password::::")
    const user = await this._sendMessage('auth.change-password', userDTO, HttpStatus.UNAUTHORIZED)
    return user
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
    this.logger.log("Validating::::")
    const user = await this._sendMessage('auth.validate', ID, HttpStatus.UNAUTHORIZED)
    return user
  }

  private async _sendMessage(topic: string, data: any, exceptionStatus: HttpStatus) {
    const stream = new Promise((resolve, reject) => {
      this.authClient
        .send(topic, JSON.stringify(data))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)

    if (response.hasOwnProperty('error'))
      throw new HttpException(response.error, exceptionStatus)
    return response
  }

  decode(token: string) {
    return this.jwtService.decode(token)
  }

  async onModuleInit() {
    console.log("AUTH Initing...")
    this.authClient.subscribeToResponseOf('auth.register')
    this.authClient.subscribeToResponseOf('auth.login')
    this.authClient.subscribeToResponseOf('auth.validate')
    this.authClient.subscribeToResponseOf('auth.verify')
    this.authClient.subscribeToResponseOf('auth.change-password')

    await this.authClient.connect();
    const topicManager = new KafkaTopicManager('auth', ['localhost:9092']);
    topicManager.createTopics(authTopicsToCreate);
  }

  async onModuleDestroy() {
    await this.authClient.close()
  }

}
