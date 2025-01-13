import { Injectable } from '@nestjs/common';

// nơi xử lý các sự kiện
//inject into : thêm vào
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
