import { Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const version = 'v1'

  app.setGlobalPrefix(`${globalPrefix}/${version}`, {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'auth/login', method: RequestMethod.POST },
      { path: 'auth/register', method: RequestMethod.POST },
      { path: 'auth/logout', method: RequestMethod.GET },
      { path: 'auth/refresh', method: RequestMethod.GET },
      { path: 'auth/:id/password', method: RequestMethod.PATCH },
      { path: 'auth/:id/block', method: RequestMethod.PATCH },
      { path: 'auth/:id/unblock', method: RequestMethod.PATCH },
    ],
  });

  app.use(cookieParser());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}/${version}`
  );
}

bootstrap();
