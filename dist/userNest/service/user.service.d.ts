import { UserResponse, UserView } from '../schema/user.schema';
import { UserRepository } from '../repository/user.repository';
export declare class UserService {
    protected userRepository: UserRepository;
    constructor(userRepository: UserRepository);
    _generateHash(password: string, salt: string): Promise<any>;
    getAllUsers(searchLoginTerm: string | null, searchEmailTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<UserResponse>;
    postUser(login: string, password: string, email: string): Promise<UserView>;
    deleteUser(id: string): Promise<boolean>;
}
