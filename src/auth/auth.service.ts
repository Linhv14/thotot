import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from 'shared/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka
  ) {}

  login(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    // this.authClient.emit('create_user', JSON.stringify(createUserDto));
  }

  register(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    // this.authClient.emit('create_user', JSON.stringify(createUserDto));
  }
}
