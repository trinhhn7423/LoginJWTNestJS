import { IsNotEmpty, IsString, Length } from 'class-validator';
import { TimeDtoCommon } from '../../../common/dto/time.dto.common';

export class AuthDto extends TimeDtoCommon {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;
}
