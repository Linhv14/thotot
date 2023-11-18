import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { CreateServiceDTO, UpdateServiceDTO } from 'src/shared/dto';
import { kafkaResponseParser } from 'src/shared/kafka/kafka.response';
import { KafkaTopicManager } from 'src/shared/kafka/kafka.topic-manager';
import { adminTopicsToCreate } from 'src/shared/kafka/topics/admin.topic';

@Injectable()
export class AdminService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(AdminService.name)
    constructor(@Inject('ADMIN_MICROSERVICE') private readonly adminClient: ClientKafka) { }

    async getService() {
        this.logger.log("Getting Service::::")
        const service = await this._sendMessage('admin.get-service', {}, HttpStatus.BAD_REQUEST)
        return service
    }

    async createService(serviceDTO: CreateServiceDTO) {
        this.logger.log("Creating Service::::")
        const service = await this._sendMessage('admin.create-service', serviceDTO, HttpStatus.BAD_REQUEST)
        return service
    }

    async updateService(serviceDTO: UpdateServiceDTO) {
        this.logger.log("Updating Service::::")
        const service = await this._sendMessage('admin.update-service', serviceDTO, HttpStatus.BAD_REQUEST)
        return service
    }

    deleteService(ID: number) {
        this.logger.log("Deleting Service::::")
        this.adminClient.emit('admin.delete-service', JSON.stringify({ID}))
    }

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
        this.adminClient.subscribeToResponseOf('admin.get-service')
        this.adminClient.subscribeToResponseOf('admin.create-service')
        this.adminClient.subscribeToResponseOf('admin.update-service')


        await this.adminClient.connect();
        const topicManager = new KafkaTopicManager('admin', ['localhost:9092']);
        topicManager.createTopics(adminTopicsToCreate);
    }

    async onModuleDestroy() {
        await this.adminClient.close()
    }
}

