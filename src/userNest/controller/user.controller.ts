import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserResponse, UserView } from '../schema/user.schema';
import { UserService } from '../service/user.service';
import { BasicAuthGuard } from '../../authNest/guards/basic-auth.guard';
import { UserInputModel } from '../../inputmodels-validation/user.inputModel';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllUsersCommand } from '../user.use-cases/getAllUsers.use-case';
import { CreateUserCommand } from '../user.use-cases/createUser.use-case';
import { DeleteUserCommand } from '../user.use-cases/deleteUser.use-case';
@UseGuards(BasicAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}
  @Get()
  async getAllUsers(
    @Query('searchLoginTerm') searchLoginTerm: string | null,
    @Query('searchEmailTerm') searchEmailTerm: string | null,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
  ): Promise<UserResponse> {
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
  }
  @Post()
  async postUser(@Body() userDto: UserInputModel): Promise<UserView> {
    return await this.commandBus.execute(new CreateUserCommand(userDto));
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
