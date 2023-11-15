import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ADMIN_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'admin',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'admin-consumer',
          },
        },
      },
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule { }
