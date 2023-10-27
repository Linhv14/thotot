import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDTO, LoginDTO } from 'shared/dto/auth.dto';
import { catchError, of } from 'rxjs';
import { Kafka, Admin } from 'kafkajs';
import { kafkaResponseParser } from 'shared/kafka/kafka.response'
import { KafkaTopicManager } from 'shared/kafka/kafka.topic';
import { authTopicsToCreate } from 'shared/kafka/topics/auth.topic';
import { error } from 'console';
@Injectable()
export class AuthService implements OnModuleInit {
  private admin: Admin
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) { }

  async login(userDTO: LoginDTO) {
    const stream = new Promise((resolve, reject) => {
      this.authClient
        .send('login', JSON.stringify(userDTO))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)
    console.log(response)
    if (response.hasOwnProperty('error')) {
      throw new HttpException(response.error, HttpStatus.UNAUTHORIZED)
    }

    return response
  }

  async register(userDTO: CreateUserDTO) {
    const stream = new Promise((resolve, reject) => {
      this.authClient
        .send('register', JSON.stringify(userDTO))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)
    if (response.hasOwnProperty('error')) {
      throw new HttpException(response.error, HttpStatus.BAD_REQUEST)
    }

    return response
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('register')
    this.authClient.subscribeToResponseOf('login')

    const topicManager = new KafkaTopicManager();
    topicManager.createTopics(authTopicsToCreate);
  }
}
