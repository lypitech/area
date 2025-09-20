import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      UsersModule,
      AuthModule,
      CommonModule,
      DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
