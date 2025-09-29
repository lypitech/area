import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LoginModule } from './login/login.module';
import { ActionsModule } from './action/action.module';
import { ActionsController } from './action/action.controller';
import { ActionsService } from './action/action.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/nestdb'),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    CommonModule,
    LoginModule,
    ActionsModule,
  ],
  controllers: [AppController, ActionsController],
  providers: [AppService, ActionsService],
})
export class AppModule {}
