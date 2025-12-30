import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RoleEnum, SwaggerApiEnumTags } from '../common/index.enum';
import {
  CreateAdminUser,
  CreateUser,
  LoginUserDto,
  TokenDto,
  UpdateUser,
  UserDto,
  UserFilterDto,
} from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.services';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { User } from 'src/entities/user.entity';
import { StandardResopnse } from 'src/common';
import { Public } from 'src/decorators/skipAuth.decorator';
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/decorators/roles.decorator';
import { UserGroup } from 'src/entities/user_group.entity';

@Controller('user')
@ApiTags(SwaggerApiEnumTags.USER)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  createUser(
    @Body() creatUser: CreateUser,
  ): Promise<StandardResopnse<CreateUser>> {
    return this.userService.createUser(creatUser);
  }

  @Post('/admin')
  @Public()
  createAdmin(
    @Body() createAdminUser: CreateAdminUser,
  ): Promise<StandardResopnse<CreateAdminUser>> {
    return this.userService.createAdminUser(createAdminUser);
  }

  @Post('login')
  @Public()
  loginUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<StandardResopnse<TokenDto>> {
    return this.userService.LoginPatronUser(loginUserDto);
  }
  @Post('admin/login')
  @Public()
  loginAdminUser(
    @Body() userDto: UserDto,
  ): Promise<StandardResopnse<TokenDto>> {
    return this.userService.LoginAdminUser(userDto);
  }

  @Patch(':id')
  updateUser(
    @Body() updateUser: UpdateUser,
    @Param('id') id: number,
  ): Promise<StandardResopnse<User>> {
    return this.userService.updateUser(id, updateUser);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  deleteUser(@Param('id') id: string): Promise<StandardResopnse<DeleteResult>> {
    return this.userService.deleteUser(id);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  async findUsers(
    @Query() paginationDto: PaginationDto,
    @Query() userFilterDto: UserFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<UserGroup>>> {
    return this.userService.findUsers(paginationDto, userFilterDto);
  }
}
