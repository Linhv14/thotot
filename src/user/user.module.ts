import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
    ]),

    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => [{
        ttl: configService.getOrThrow('USER_RATE_TTL'),
        limit: configService.getOrThrow('USER_RATE_LIMIT'),
      }],
      inject: [ConfigService],
    }),

  ],
  controllers: [UserController],
  providers: [UserService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },],
})
export class UserModule { }
