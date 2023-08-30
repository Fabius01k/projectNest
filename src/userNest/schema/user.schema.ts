import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
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

@Schema()
export class User {
  @Prop({ type: ObjectId, required: true })
  _id: ObjectId;
  @Prop({ type: String, required: true })
  id: string;
  @Prop(
    raw({
      resetPasswordCode: { type: String, default: null },
      expirationDatePasswordCode: { type: Date, default: null },
    }),
  )
  passwordUpdate: PasswordUpdateType;
  @Prop(
    raw({
      userName: raw({
        login: { type: String, required: true },

        email: { type: String, required: true },
      }),
      passwordHash: { type: String, required: true },
      passwordSalt: { type: String, required: true },
      createdAt: { type: String, required: true },
    }),
  )
  accountData: AccountDataType;

  @Prop(
    raw({
      confirmationCode: { type: String, required: true },
      expirationDate: { type: Date, required: true },
      isConfirmed: { type: Boolean, required: true },
    }),
  )
  emailConfirmation: EmailConfirmationType;

  constructor(
    _id: ObjectId,
    id: string,
    accountData: {
      userName: {
        login: string;
        email: string;
      };
      passwordHash: string;
      passwordSalt: string;
      createdAt: string;
    },
    emailConfirmation: {
      confirmationCode: string;
      expirationDate: Date;
      isConfirmed: boolean;
    },
    passwordUpdate: {
      resetPasswordCode?: string | null;
      expirationDatePasswordCode?: Date | null;
    },
  ) {
    this._id = _id;
    this.id = id;
    this.accountData = accountData;
    this.emailConfirmation = emailConfirmation;
    this.passwordUpdate = passwordUpdate;
  }
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

export const UserSchema = SchemaFactory.createForClass(User);
