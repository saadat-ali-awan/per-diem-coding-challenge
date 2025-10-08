import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail() email!: string;
  @MinLength(6) @IsString() password!: string;
}
export class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}
