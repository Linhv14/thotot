import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { CoordinateDTO, UpdateWorkingModeDTO } from 'src/shared/dto';
import { kafkaResponseParser } from 'src/shared/kafka/kafka.response';
import { KafkaTopicManager } from 'src/shared/kafka/kafka.topic-manager';

import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { workerTopicsToCreate } from 'src/shared/kafka/topics';
@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(WorkerService.name)
    constructor(@Inject('WORKER_MICROSERVICE') private readonly workerClient: ClientKafka,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async toggleWorkingMode(workerDTO: UpdateWorkingModeDTO) {
        this.logger.log("Toggle working mode:::")
        this.workerClient.emit('worker.toggle-working-mode', workerDTO)
        await this.cacheManager.del(workerDTO.ID.toString())
    }

    async updateCoordinate(coordinate: CoordinateDTO, ID: number) {
        this.logger.log("User updating coordinate::::",)
        this.workerClient.emit('worker.update-coordinate', JSON.stringify({
          ID,
          ...coordinate
        }))
        await this.cacheManager.del(ID.toString())
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
        this.workerClient.subscribeToResponseOf('worker.get-all')


        await this.workerClient.connect();
        const topicManager = new KafkaTopicManager('worker', ['localhost:9092']);
        topicManager.createTopics(workerTopicsToCreate);
    }

    async onModuleDestroy() {
        await this.workerClient.close()
    }
}

