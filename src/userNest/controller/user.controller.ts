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

import { UserInputModel } from '../../authNest/auth-inputModel.ts/auth.inputModel';
import { BasicAuthGuard } from '../../authNest/strategies/basic.strategy';
@UseGuards(BasicAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
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
      sortBy = 'accountData.createdAt';
    }
    if (sortBy === 'login') {
      sortBy = 'accountData.userName.login';
    }
    if (sortBy === 'email') {
      sortBy = 'accountData.userName.email';
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

    return await this.userService.getAllUsers(
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
    );
  }
  @Post()
  async postUser(@Body() userDto: UserInputModel): Promise<UserView> {
    return await this.userService.postUser(userDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteUser(id);
  }
}
