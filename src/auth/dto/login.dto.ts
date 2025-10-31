import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;
 
  @IsString()
  @IsNotEmpty()
  password: string;
}
