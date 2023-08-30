/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
export type EmailConfirmationType = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
};
export type AccountDataType = {
    userName: {
        login: string;
        email: string;
    };
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
};
export type PasswordUpdateType = {
    resetPasswordCode?: string | null;
    expirationDatePasswordCode?: Date | null;
};
export type UserDocument = HydratedDocument<User>;
export declare class User {
    _id: ObjectId;
    id: string;
    passwordUpdate: PasswordUpdateType;
    accountData: AccountDataType;
    emailConfirmation: EmailConfirmationType;
    constructor(_id: ObjectId, id: string, accountData: {
        userName: {
            login: string;
            email: string;
        };
        passwordHash: string;
        passwordSalt: string;
        createdAt: string;
    }, emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    }, passwordUpdate: {
        resetPasswordCode?: string | null;
        expirationDatePasswordCode?: Date | null;
    });
}
export type UserView = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
};
export interface UserResponse {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserView[];
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User> & User & Required<{
    _id: ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, User> & User & Required<{
    _id: ObjectId;
}>>;
