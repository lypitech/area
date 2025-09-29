import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LoginModule } from './login/login.module';
<<<<<<< HEAD
import { ReactionsModule } from './reaction/reaction.module';
=======
import { ReactionModule } from './reaction/reaction.module';
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/nestdb'),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    CommonModule,
    LoginModule,
<<<<<<< HEAD
    ReactionsModule,
=======
    ReactionModule,
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
