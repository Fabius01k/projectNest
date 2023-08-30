import { User, UserDocument, UserResponse, UserView } from '../schema/user.schema';
import { Model } from 'mongoose';
export declare class UserRepository {
    protected userModel: Model<UserDocument>;
    constructor(userModel: Model<UserDocument>);
    findAllUsersInDb(searchLoginTerm: string | null, searchEmailTerm: string | null, sortBy: string, sortDirection: 'asc' | 'desc', pageSize: number, pageNumber: number): Promise<UserResponse>;
    createUserInDb(newUser: User): Promise<UserView>;
    deleteUserInDb(id: string): Promise<boolean>;
}
