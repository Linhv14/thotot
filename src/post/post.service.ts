import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { CreatePostDTO } from 'src/shared/dto';
import { kafkaResponseParser } from 'src/shared/kafka/kafka.response';
import { KafkaTopicManager } from 'src/shared/kafka/kafka.topic-manager';
import { postTopicsToCreate } from 'src/shared/kafka/topics';

@Injectable()
export class PostService implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(PostService.name)
    constructor(@Inject('POST_MICROSERVICE') private readonly postClient: ClientKafka) { }

    async create(postDTO: CreatePostDTO) {
        this.logger.log("Creating post::::", JSON.stringify(postDTO))
        const post = await this._sendMessage('post.create', postDTO, HttpStatus.BAD_REQUEST)

        return post
    }

    private async _sendMessage(topic: string, data: any, exceptionStatus: HttpStatus) {
        const stream = new Promise((resolve, reject) => {
            this.postClient
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
        console.log("POST Initing...")
        this.postClient.subscribeToResponseOf('post.create')


        await this.postClient.connect();
        const topicManager = new KafkaTopicManager('post', ['localhost:9092']);
        topicManager.createTopics(postTopicsToCreate);
    }

    async onModuleDestroy() {
        await this.postClient.close()
    }
}