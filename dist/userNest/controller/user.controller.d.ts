import { UserResponse, UserView } from '../schema/user.schema';
import { UserService } from '../service/user.service';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(searchLoginTerm: string | null, searchEmailTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<UserResponse>;
    postUser(login: string, password: string, email: string): Promise<UserView>;
    deleteUser(id: string, res: Response): Promise<boolean>;
}
