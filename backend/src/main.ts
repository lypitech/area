import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.use('/action/github', bodyParser.raw({ type: '*/*' }));
  app.use('/hook/github', bodyParser.raw({ type: '*/*' }));
  app.use(bodyParser.json());

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}

bootstrap();
