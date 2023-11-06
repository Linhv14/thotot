import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payments.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from 'src/auth/auth.service';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
