import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthEntity } from './modules/auth/auth.entity';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

const typeOrmOption: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test',
  entities: [AuthEntity],
  synchronize: true, // tạo bảng tự động
};

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmOption), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('dataSource', dataSource.logger);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
