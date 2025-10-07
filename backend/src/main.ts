import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { User } from './user/schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Area API')
    .setDescription('The Documentation for the Area API')
    .setVersion('1.0')
    .addTag('area')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { extraModels: [User] });

  SwaggerModule.setup('api', app, documentFactory);

  app.use('/action/github', bodyParser.raw({ type: '*/*' }));
  app.use('/hook/github', bodyParser.raw({ type: '*/*' }));
  app.use(bodyParser.json());

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}

bootstrap();
