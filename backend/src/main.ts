import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { User } from './user/schemas/user.schema';
import { ValidationPipe } from '@nestjs/common';
import { SeederService } from './list/setup/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;

  app.enableCors({
    origin: [ 'http://localhost:4173', 'http://localhost:5173', 'http://localhost:8081' ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Area API')
    .setDescription('The Documentation for the Area API')
    .setVersion('1.0')
    .build();
  const seeder = app.get(SeederService);
  await seeder.populate();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { extraModels: [User] });

  SwaggerModule.setup('api', app, documentFactory);

  app.use('/action/github', bodyParser.raw({ type: '*/*' }));
  app.use('/hook/github', bodyParser.raw({ type: '*/*' }));
  app.use('/discord', bodyParser.raw({ type: '*/*' }));
  app.use(bodyParser.json());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}

bootstrap();
