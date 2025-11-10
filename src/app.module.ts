import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.services';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repositoty';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './middleware/exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/authGuard';
import { GroupRepository } from './repositories/group.repository';
import { UserGroupRepository } from './repositories/userGroup.repository';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user_group.entity';
import { RolesGuard } from './guards/roleGuard';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.createTypeOrmOptions()),
    TypeOrmModule.forFeature([User, Group, UserGroup]),
    JwtModule.register({
      global: true,
      secret: 'value',
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    UserService,
    UserRepository,
    GroupRepository,
    UserGroupRepository,
  ],
})
export class AppModule {}
