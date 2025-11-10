import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { BaseFilterDto } from './baseFilter.dto';
import { Match } from 'src/decorators/match.decorator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @MinLength(7)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserDto extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  inviteCode: string;
}

export class CreateAdminUser extends UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  groupDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @MinLength(7)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}

export class CreateUser extends LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  inviteCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @MinLength(7)
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}

export class UpdateUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class TokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupId?: string;
}

export class UserFilterDto extends BaseFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchQuery?: string;
}
