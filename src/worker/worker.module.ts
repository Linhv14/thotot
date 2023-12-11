import { Global, Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WORKER_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'worker',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'worker-consumer',
          },
        },
      },
    ]),
  ],
  providers: [WorkerService],
  controllers: [WorkerController],
})
export class WorkerModule {}
