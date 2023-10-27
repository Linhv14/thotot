import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payments.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule, PaymentModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
