import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopicManager } from 'src/shared/kafka/kafka.topic-manager';
import { userTopicsToCreate } from 'src/shared/kafka/topics';
import { catchError, of } from 'rxjs';
import { kafkaResponseParser } from 'src/shared/kafka/kafka.response';
import { OptionsDTO } from 'src/shared/dto';

@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UserService.name)
  constructor(@Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka) { }

  async getAll(options: OptionsDTO) {
    this.logger.log("Getting all users::::")
    const users = await this._sendMessage('user.get-all', options)
    return users
  }

  async getProfile(ID: number) {
    this.logger.log("User Geting profile::::", ID)
    const user = await this._sendMessage('user.find-id', {ID})
    return user
  }

  update(user: any) {
    this.logger.log("User updating::::")
    this.userClient.emit('user.update', JSON.stringify(user))
  }

  private async _sendMessage(topic: string, data: any, exceptionStatus: HttpStatus = HttpStatus.BAD_REQUEST) {
    const stream = new Promise((resolve, reject) => {
      this.userClient
        .send(topic, JSON.stringify(data))
        .pipe(catchError(val => of({ error: val.message })))
        .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)

    if (response.hasOwnProperty('error'))
      throw new HttpException(response.error, exceptionStatus)
    return response
  }

  async onModuleInit() {
    console.log("USER Initing...")
    this.userClient.subscribeToResponseOf('user.find-id')
    this.userClient.subscribeToResponseOf('user.get-all')


    await this.userClient.connect();
    const topicManager = new KafkaTopicManager('user', ['localhost:9092']);
    topicManager.createTopics(userTopicsToCreate);
  }

  async onModuleDestroy() {
    await this.userClient.close()
  }
}
