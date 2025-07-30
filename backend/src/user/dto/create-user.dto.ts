import { IsEmail, IsEnum, IsString, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
