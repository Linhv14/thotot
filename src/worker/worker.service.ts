import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { UpdateWorkingModeDTO } from 'src/shared/dto';
import { kafkaResponseParser } from 'src/shared/kafka/kafka.response';
import { KafkaTopicManager } from 'src/shared/kafka/kafka.topic-manager';
import { workerTopicsToCreate } from 'src/shared/kafka/topics/worker.topic';

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(WorkerService.name)
    constructor(@Inject('WORKER_MICROSERVICE') private readonly workerClient: ClientKafka) { }

    toggleWorkingMode(workerDTO: UpdateWorkingModeDTO) {
        this.workerClient.emit('worker.toggle-working-mode', workerDTO)
    }

    private async _sendMessage(topic: string, data: any, exceptionStatus: HttpStatus) {
        const stream = new Promise((resolve, reject) => {
            this.workerClient
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
        console.log("WORKER Initing...")
        this.workerClient.subscribeToResponseOf('worker.test')


        await this.workerClient.connect();
        const topicManager = new KafkaTopicManager('worker', ['localhost:9092']);
        topicManager.createTopics(workerTopicsToCreate);
    }

    async onModuleDestroy() {
        await this.workerClient.close()
    }
}

