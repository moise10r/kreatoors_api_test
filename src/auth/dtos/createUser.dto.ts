import { IsString, IsEmail, IsOptional, IsBoolean } from "class-validator";

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsBoolean()
  isVerified!: boolean;
}
