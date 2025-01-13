import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './auth.entity';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Delete(':id')
  // deleteUser(@Param('id') id: string) {
  //   return this.authService.deleteUser(id);
  // }

  @Post('register')
  authRegister(@Body() body: AuthDto) {
    return this.authService.createUser(body);
  }

  @Post('login')
  authLogin(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('')
  @UseGuards(AuthGuard)
  async authGetAll(): Promise<AuthEntity[]> {
    const users = await this.authService.getAll();
    return plainToInstance(AuthEntity, users);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async authGetById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<AuthEntity> {
    // console.log('req', (req as any).user);
    const user = await this.authService.getOne(id);
    return plainToInstance(AuthEntity, user);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.refreshToken(body.refresh_token);
  }
}
