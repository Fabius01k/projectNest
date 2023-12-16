import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserResponse, UserView } from '../schema/user.schema';
import { UserService } from '../service/user.service';
import { BasicAuthGuard } from '../../authNest/guards/basic-auth.guard';
import {
  BanUserInputModel,
  UserInputModel,
} from '../../inputmodels-validation/user.inputModel';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllUsersCommand } from '../user.use-cases/getAllUsers.use-case';
import { CreateUserCommand } from '../user.use-cases/createUser.use-case';
import { DeleteUserCommand } from '../user.use-cases/deleteUser.use-case';
import { BanUserCommand } from '../user.use-cases/banUser.use-case';
import { GetBannedUsersCommand } from '../user.use-cases/getBannedUsers.use-case';
@UseGuards(BasicAuthGuard)
@Controller('sa')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}
  @Put('users/:id/ban')
  @HttpCode(204)
  async banUser(
    @Param('id') id: string,
    @Body() banUserDto: BanUserInputModel,
  ): Promise<void> {
    return await this.commandBus.execute(new BanUserCommand(id, banUserDto));
  }
  @Get('users')
  async getAllUsers(
    @Query('banStatus')
    banStatus: 'all' | 'banned' | 'notBanned',
    @Query('searchLoginTerm') searchLoginTerm: string | null,
    @Query('searchEmailTerm') searchEmailTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<UserResponse> {
    if (!banStatus) {
      banStatus = 'all';
    }
    if (banStatus === 'banned') {
      banStatus = 'banned';
    }
    if (banStatus === 'notBanned') {
      banStatus = 'notBanned';
    }

    if (!searchLoginTerm) {
      searchLoginTerm = null;
    }

    if (!searchEmailTerm) {
      searchEmailTerm = null;
    }

    if (!sortBy) {
      sortBy = 'createdAt';
    }
    if (sortBy === 'login') {
      sortBy = 'login';
    }
    if (sortBy === 'email') {
      sortBy = 'email';
    }

    if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
      sortDirection = 'desc';
    }

    const checkPageSize = +pageSize;
    if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
      pageSize = 10;
    }

    const checkPageNumber = +pageNumber;
    if (
      !pageNumber ||
      !Number.isInteger(checkPageNumber) ||
      checkPageNumber <= 0
    ) {
      pageNumber = 1;
    }

    if (banStatus === 'all') {
      console.log(banStatus, 'status controller all ');
      return await this.commandBus.execute(
        new GetAllUsersCommand(
          searchLoginTerm,
          searchEmailTerm,
          sortBy,
          sortDirection,
          pageSize,
          pageNumber,
        ),
      );
    } else {
      console.log(banStatus, 'status controller not all');
      return await this.commandBus.execute(
        new GetBannedUsersCommand(
          banStatus,
          searchLoginTerm,
          searchEmailTerm,
          sortBy,
          sortDirection,
          pageSize,
          pageNumber,
        ),
      );
    }

    // return await this.commandBus.execute(
    //   new GetAllUsersCommand(
    //     searchLoginTerm,
    //     searchEmailTerm,
    //     sortBy,
    //     sortDirection,
    //     pageSize,
    //     pageNumber,
    //   ),
    // );
  }

  @Post('users')
  async postUser(@Body() userDto: UserInputModel): Promise<UserView> {
    return await this.commandBus.execute(new CreateUserCommand(userDto));
  }

  @Delete('users/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
