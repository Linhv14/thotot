import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { UploadModule } from 'src/upload/upload.module';
import { PostModule } from 'src/post/post.module';
import { AdminModule } from 'src/admin/admin.module';
import { WorkerModule } from 'src/worker/worker.module';
import { RedisModule } from 'src/redis/redis.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RolesGuard } from 'src/shared/guards';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => [{
        ttl: configService.getOrThrow('RATE_TTL'),
        limit: configService.getOrThrow('RATE_LIMIT'),
      }],
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    // PostModule,
    UploadModule,
    WorkerModule,
    AdminModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
