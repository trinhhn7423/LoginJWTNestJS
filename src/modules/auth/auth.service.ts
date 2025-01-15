import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

interface Payload {
  id: number;
  username: string;
}

// Service giúp lưu trữ và truy xuất dữ liệu và được thiết kế để sử dụng bởi controller
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    private jwtService: JwtService,
  ) {}

  async createUser(data: AuthDto) {
    try {
      const checkUser = await this.authRepository.findOne({
        where: { username: data.username },
      });

      if (checkUser) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(data.password, saltOrRounds);
      await this.authRepository.save({
        ...data,
        created_at: new Date(),
        password: hash,
      });
      return { message: 'User created successfully' };
    } catch (error) {
      if (error.status !== 500) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '120s',
      secret: 'secret',
    });
  }

  generateRefreshToken(payload: Payload) {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: 'secretRefresh',
    });
  }

  async login(
    data: LoginDto,
  ): Promise<{ access_token: string; message: string; refresh_token: string }> {
    try {
      const user = await this.authRepository.findOne({
        where: { username: data.username },
      });
      if (!user) {
        throw new HttpException(
          'Incorrect account or password',
          HttpStatus.NOT_FOUND,
        );
      }
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (isMatch === true) {
        const payload = { id: user.id, username: user.username };
        return {
          message: 'Login successfully',
          access_token: this.generateAccessToken(payload),
          refresh_token: this.generateRefreshToken(payload),
        };
      } else {
        // console.log('go here');
        throw new UnauthorizedException('Incorrect account or password');
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async refreshToken(refresh_token: string) {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: 'secretRefresh',
      });
      console.log('verify', verify);

      return {
        access_token: this.generateAccessToken({
          id: verify.id,
          username: verify.username,
        }),
        refresh_token: this.generateRefreshToken({
          id: verify.id,
          username: verify.username,
        }),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getAll(): Promise<AuthEntity[]> {
    return this.authRepository.find();
  }

  async getOne(id: number): Promise<AuthEntity> {
    try {
      // console.log('process.env.DATABASE_HOST', process.env.DATABASE_HOST);
      const user = await this.authRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (e) {
      console.log(e);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
