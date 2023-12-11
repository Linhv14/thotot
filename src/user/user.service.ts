import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopicManager } from 'src/shared/kafka/kafka.topic-manager';
import { userTopicsToCreate } from 'src/shared/kafka/topics';
import { catchError, of } from 'rxjs';
import { kafkaResponseParser } from 'src/shared/kafka/kafka.response';
import { OptionsDTO } from 'src/shared/dto';

import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UserService.name)
  constructor(
    @Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async getAll(options: OptionsDTO) {
    this.logger.log("Getting all users::::")
    let cacheData = await this.cacheManager.get('users' + JSON.stringify(options))
    if (cacheData) {
      console.log("data from cache")
      return cacheData
    }
    const users = await this._sendMessage('user.get-all', options)
    console.log("data from db")
    await this.cacheManager.set('users' + JSON.stringify(options), users, 60)
    return users
  }

  async getProfile(ID: number) {
    console.log(ID.toString())
    this.logger.log("User Getting profile::::", ID)
    const cacheData = await this.cacheManager.get(ID.toString())

    if (cacheData) {
      console.log("data from cache")
      return cacheData
    }

    const user = await this._sendMessage('user.find-id', { ID })
    console.log("data from db")
    await this.cacheManager.set(ID.toString(), user, 60)
    
    return user
  }

  async update(user: any) {
    this.logger.log("User updating::::")
    this.userClient.emit('user.update', JSON.stringify(user))
    await this.cacheManager.del(user.ID.toString())
  }

  async findNearBy() {
    this.logger.log("User finding near by::::",)
    const woker = await this._sendMessage('user.find-nearby', {})
    return woker
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
    this.userClient.subscribeToResponseOf('user.find-nearby')


    await this.userClient.connect();
    const topicManager = new KafkaTopicManager('user', ['localhost:9092']);
    topicManager.createTopics(userTopicsToCreate);
  }

  async onModuleDestroy() {
    await this.userClient.close()
  }

}
