import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { UploadModule } from 'src/upload/upload.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    AuthModule, 
    UserModule,
    PostModule,
    UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
