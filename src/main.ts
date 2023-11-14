import { Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { UserValidationPipe } from 'src/shared/pips/validation.pip';

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
      { path: 'auth/change-password', method: RequestMethod.PATCH },
    ],
  });

  app.useGlobalPipes(UserValidationPipe);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}/${version}`
  );
}

bootstrap();
