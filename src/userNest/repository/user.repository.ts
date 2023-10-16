// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import {
//
//   UserResponse,
//   UserView,
// } from '../schema/user.schema';
// import { Model } from 'mongoose';
//
//
// const mapUserToDto = (user: User): UserView => {
//   return {
//     id: user.id,
//     login: user.accountData.userName.login,
//     email: user.accountData.userName.email,
//     createdAt: user.accountData.createdAt,
//   };
// };
// @Injectable()
// export class UserRepository {
//   constructor(
//     @InjectModel(User.name) protected userModel: Model<UserDocument>,
//     @InjectModel(UserSession.name)
//     protected userSessionModel: Model<UserSessionDocument>,
//   ) {}
//
//   async findAllUsersInDb(
//     searchLoginTerm: string | null,
//     searchEmailTerm: string | null,
//     sortBy: string,
//     sortDirection: 'asc' | 'desc',
//     pageSize: number,
//     pageNumber: number,
//   ): Promise<UserResponse> {
//     const filter = {
//       $or: [
//         {
//           'accountData.userName.login': {
//             $regex: searchLoginTerm ?? '',
//             $options: 'i',
//           },
//         },
//         {
//           'accountData.userName.email': {
//             $regex: searchEmailTerm ?? '',
//             $options: 'i',
//           },
//         },
//       ],
//     };
//
//     const users: User[] = await this.userModel
//       .find(filter)
//       .sort({ [sortBy]: sortDirection })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize)
//       .exec();
//
//     const items = users.map((u) => mapUserToDto(u));
//     const totalCount = await this.userModel.countDocuments(filter);
//
//     return {
//       pagesCount: Math.ceil(totalCount / pageSize),
//       page: +pageNumber,
//       pageSize: +pageSize,
//       totalCount: totalCount,
//       items: items,
//     };
//   }
//
//   async createUserInDb(newUser: User): Promise<UserView> {
//     const createdUser = new this.userModel(newUser);
//     await createdUser.save();
//
//     return mapUserToDto(newUser);
//   }
//
//   async registrationUser(newUserToRegistration: User): Promise<boolean> {
//     const createdUser = new this.userModel(newUserToRegistration);
//     await createdUser.save();
//
//     return true;
//   }
//
//   async deleteUserInDb(id: string): Promise<boolean> {
//     const deletedUser = await this.userModel.deleteOne({ id: id });
//
//     return deletedUser.deletedCount === 1;
//   }
//
//   async getUserByLoginOrEmail(loginOrEmail: string) {
//     const user = await this.userModel.findOne({
//       $or: [
//         { 'accountData.userName.email': loginOrEmail },
//         { 'accountData.userName.login': loginOrEmail },
//       ],
//     });
//     return user;
//   }
//
//   async createUserSessionInDb(newUserSession): Promise<UserSession> {
//     const createdSession = new this.userSessionModel(newUserSession);
//     await createdSession.save();
//
//     return createdSession;
//   }
//
//   async changeDataInSessionInDb(deviceId: string, refreshToken: string) {
//     const result = await this.userSessionModel.updateOne(
//       { deviceId },
//       {
//         $set: {
//           refreshToken: refreshToken,
//           lastActiveDate: new Date().toISOString(),
//           tokenCreationDate: new Date(),
//           tokenExpirationDate: new Date(Date.now() + 20000),
//         },
//       },
//     );
//
//     return result.modifiedCount === 1;
//   }
//
//   async deleteSessionInDb(deviceId: string) {
//     const deletedSession = await this.userSessionModel.deleteOne({
//       deviceId: deviceId,
//     });
//
//     return deletedSession.deletedCount === 1;
//   }
//
//   async getUserByConfirmationCode(code: string) {
//     const user = await this.userModel.findOne({
//       'emailConfirmation.confirmationCode': code,
//     });
//     return user;
//   }
//
//   async updateConfirmation(id: string) {
//     const result = await this.userModel.updateOne(
//       { id: id },
//       { $set: { 'emailConfirmation.isConfirmed': true } },
//     );
//
//     return result.modifiedCount === 1;
//   }
//
//   async getUserByResetPasswordCode(recoveryCode: string) {
//     const user = await this.userModel.findOne({
//       'passwordUpdate.resetPasswordCode': recoveryCode,
//     });
//     return user;
//   }
//
//   async changeConfirmationCode(id: string, confirmationCode: string) {
//     const result = await this.userModel.updateOne(
//       { id: id },
//       { $set: { 'emailConfirmation.confirmationCode': confirmationCode } },
//     );
//     return result.modifiedCount === 1;
//   }
//
//   async changePasswordInDb(
//     id: string,
//     passwordSalt: string,
//     passwordHash: string,
//   ) {
//     const result = await this.userModel.updateOne(
//       { id: id },
//       {
//         $set: {
//           'accountData.passwordSalt': passwordSalt,
//           'accountData.passwordHash': passwordHash,
//         },
//       },
//     );
//
//     return result.modifiedCount === 1;
//   }
//
//   async changeResetPasswordCode(
//     id: string,
//     NewResetPasswordCode: string,
//     NewExpirationDatePasswordCode: Date,
//   ) {
//     const result = await this.userModel.updateOne(
//       { id: id },
//       {
//         $set: {
//           'passwordUpdate.resetPasswordCode': NewResetPasswordCode,
//           'passwordUpdate.expirationDatePasswordCode':
//             NewExpirationDatePasswordCode,
//         },
//       },
//     );
//
//     return result.modifiedCount === 1;
//   }
//   async findUserByIdInDb(id: string) {
//     const user = await this.userModel.findOne({ id: id });
//
//     return user ? mapUserToDto(user) : null;
//   }
//   async findUserInformationByIdInDb(id: string) {
//     const user = await this.userModel.findOne({ id: id });
//
//     return user;
//   }
//   async findSessionByRefreshToken(refreshToken: string) {
//     const session = await this.userSessionModel.findOne({
//       refreshToken: refreshToken,
//     });
//     return session;
//   }
// }
