import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StandardResopnse } from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import {
  CreateAdminUser,
  CreateUser,
  LoginUserDto,
  TokenDto,
  UpdateUser,
  UserDto,
  UserFilterDto,
} from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repositoty';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserGroupRepository } from 'src/repositories/userGroup.repository';
import { Group } from 'src/entities/group.entity';
import { GroupRepository } from 'src/repositories/group.repository';
import { generateInviteCode } from 'src/utils';
import { DeleteResult } from 'typeorm';
import { RoleEnum } from 'src/common/index.enum';
import { UserGroup } from 'src/entities/user_group.entity';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userGroupRepository: UserGroupRepository,
    private groupRepository: GroupRepository,
    private jwtService: JwtService,
  ) {}

  async createAdminUser(
    createUser: CreateAdminUser,
  ): Promise<StandardResopnse<CreateAdminUser>> {
    const saltOrRounds = 10;
    const _password = await bcrypt.hash(createUser.password, saltOrRounds);

    const existingUser = await this.userRepository.findUserByEmail(
      createUser.email,
    );

    if (existingUser) {
      throw new NotFoundException('Email Address Already Exists');
    }

    const __existingUser = await this.userRepository.findOne({
      phone: createUser.phone,
    });

    if (__existingUser) {
      throw new NotFoundException('Phone Number Already Exists');
    }

    const existingUserGroup =
      await this.userGroupRepository.findUserGroupByEmailAndRole(
        createUser.email,
        RoleEnum.ADMIN,
      );

    if (existingUserGroup) {
      throw new NotFoundException(
        'Admin Account Already Exists for this Group',
      );
    }

    const inviteCode = generateInviteCode();

    // Use your base repository transaction helper
    await this.userRepository.transaction(async (userTxRepo) => {
      // Get other transactional repositories
      const groupTxRepo = userTxRepo.manager.getRepository(Group);
      const userGroupTxRepo = userTxRepo.manager.getRepository(UserGroup);

      // Create user
      const user = userTxRepo.create({
        ...createUser,
        passwordHash: _password,
        email: createUser.email,
      });

      const userCreated = await userTxRepo.save(user);

      // Create group
      const group = groupTxRepo.create({
        name: createUser.groupName,
        description: createUser.groupDescription,
        inviteCode,
      });
      const groupCreated = await groupTxRepo.save(group);

      // Create user-group link
      await userGroupTxRepo.save({
        userId: userCreated.id,
        groupId: groupCreated.id,
        role: RoleEnum.ADMIN,
      });
    });

    return {
      data: createUser,
      code: 200,
      message: 'Success',
    };
  }

  async createUser(
    createUser: CreateUser,
  ): Promise<StandardResopnse<CreateUser>> {
    const saltOrRounds = 10;
    const _password = await bcrypt.hash(createUser.password, saltOrRounds);

    const _existingGroup = await this.groupRepository.findGroupByInviteCode(
      createUser.inviteCode,
    );

    if (!_existingGroup) {
      throw new UnprocessableEntityException('Invalid Invite Code');
    }

    const existingUser = await this.userRepository.findUserByEmail(
      createUser.email,
    );

    if (existingUser) {
      throw new NotFoundException('Email Address Already Exists');
    }

    const __existingUser = await this.userRepository.findOne({
      phone: createUser.phone,
    });

    if (__existingUser) {
      throw new NotFoundException('Phone Number Already Exists');
    }

    await this.userRepository.transaction(async (userTxRepo) => {
      // Get other transactional repositories
      const userGroupTxRepo = userTxRepo.manager.getRepository(UserGroup);

      // Create user
      const user = userTxRepo.create({
        ...createUser,
        passwordHash: _password,
        email: createUser.email,
      });

      const userCreated = await userTxRepo.save(user);

      // Create user-group link
      await userGroupTxRepo.save({
        userId: userCreated.id,
        groupId: _existingGroup.id,
        role: RoleEnum.PATRON,
      });
    });

    return {
      data: createUser,
      code: 200,
      message: 'Success',
    };
  }

  async updateUser(
    id: number,
    updateUser: UpdateUser,
  ): Promise<StandardResopnse<User>> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User Not found');
    }

    Object.assign(existingUser, updateUser);

    await this.userRepository.create({
      ...existingUser,
      updated_at: new Date().toISOString(),
    });

    return {
      data: plainToInstance(User, updateUser),
      code: 200,
      message: 'Success',
    };
  }

  async deleteUser(id: string): Promise<StandardResopnse<DeleteResult>> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User Not found');
    }

    await this.userRepository.delete(id, true);

    return {
      data: null,
      code: 200,
      message: 'Success',
    };
  }

  async findUsers(
    paginationDto: PaginationDto,
    userFilterDto: UserFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<UserGroup>>> {
    const result = await this.userGroupRepository.findAllUsers(
      paginationDto,
      userFilterDto,
    );

    return {
      data: result,
      code: 200,
      message: 'Success',
    };
  }

  async LoginAdminUser(user: UserDto) {
    const callBack = async () =>
      await this.userRepository.findUserByEmail(user.email);

    return this.LoginUser(user, callBack);
  }

  async LoginPatronUser(loginUser: LoginUserDto) {
    const group = await this.groupRepository.findGroupByInviteCode(
      loginUser.inviteCode,
    );

    if (!group) {
      throw new UnprocessableEntityException('Invalid Invite Code');
    }

    const callBack = async () =>
      await this.userRepository.findUserByEmail(loginUser.email);

    return this.LoginUser(loginUser, callBack);
  }

  async LoginUser(
    loginUser: LoginUserDto | UserDto,
    callBack: () => Promise<User>,
  ): Promise<StandardResopnse<TokenDto>> {
    const user = await callBack();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userGroup = await this.userGroupRepository.findUserGroupByEmailAndRole(
      loginUser.email,
      RoleEnum.ADMIN,
    );

    const isMatch = await bcrypt.compare(loginUser.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Incorrect Password');
    }

    const _user: TokenDto = {
      // id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      groupId: userGroup.groupId,
    };
    return {
      code: 200,
      message: 'success',
      data: {
        ..._user,
        token: await this.jwtService.signAsync({ ..._user }),
      },
    };
  }
}
