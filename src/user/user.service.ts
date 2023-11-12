import { HttpException, HttpStatus, Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopicManager } from '../../shared/kafka/kafka.topic-manager';
import { userTopicsToCreate } from '../../shared/kafka/topics/user.topic';
import { catchError, of } from 'rxjs';
import { kafkaResponseParser } from '../../shared/kafka/kafka.response';

@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka) { }

  async getProfile(ID: number) {
    const stream = new Promise((resolve, reject) => {
      this.userClient
        .send('user.find-id', JSON.stringify(ID))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })

    const response = await kafkaResponseParser(stream)
    if (response.hasOwnProperty('error')) {
      throw new HttpException(response.error, HttpStatus.BAD_REQUEST)
    }
    return response
  }

  async update(user: any) {
    console.log("Updating profile::::")
    return this.userClient.emit('user.update', JSON.stringify(user))
  }

  async onModuleInit() {
    console.log("USER Initing...")
    this.userClient.subscribeToResponseOf('user.find-id')


    await this.userClient.connect();
    const topicManager = new KafkaTopicManager('user', ['localhost:9092']);
    topicManager.createTopics(userTopicsToCreate);
  }

  async onModuleDestroy() {
    await this.userClient.close()
  }
}
