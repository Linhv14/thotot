import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { kafkaResponseParser } from 'src/shared/kafka/kafka.response';
import { KafkaTopicManager } from 'src/shared/kafka/kafka.topic-manager';
import { adminTopicsToCreate } from 'src/shared/kafka/topics/admin.topic';

@Injectable()
export class AdminService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(AdminService.name)
    constructor(@Inject('ADMIN_MICROSERVICE') private readonly adminClient: ClientKafka) { }


    private async _sendMessage(topic: string, data: any, exceptionStatus: HttpStatus) {
        const stream = new Promise((resolve, reject) => {
            this.adminClient
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
        console.log("ADMIN Initing...")
        this.adminClient.subscribeToResponseOf('admin.test')


        await this.adminClient.connect();
        const topicManager = new KafkaTopicManager('admin', ['localhost:9092']);
        topicManager.createTopics(adminTopicsToCreate);
    }

    async onModuleDestroy() {
        await this.adminClient.close()
    }
}

