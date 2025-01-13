import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from '../../common/middleware/logger.middleware';

console.log('process.env.PORT');

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]), /// sử dụng repository
    JwtModule.register({
      global: true,
      secret: 'secret',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
