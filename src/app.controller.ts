import { Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('trinh')
  @HttpCode(203)
  postTrinh(@Req() request: Request): string {
    console.log('post trinh', request.body);
    return 'post trinh';
  }
}
