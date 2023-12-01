import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';


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
    UserModule
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule { }
