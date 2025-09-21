import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const port: string | undefined = '3000';

  if (!port) {
    Logger.warn('Expected PORT value in environment variables');
    return;
  }
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}

bootstrap();
