// import { ObjectId, WithId } from 'mongodb';
// import mongoose from 'mongoose';
// import { ClassUserAccountDb } from '../../classes/users/users-class';
//
// export const usersSchema = new mongoose.Schema<WithId<ClassUserAccountDb>>({
//   _id: { type: ObjectId, require: true },
//   id: { type: String, require: true },
//   accountData: {
//     userName: {
//       login: { type: String, require: true },
//       email: { type: String, require: true },
//     },
//     passwordHash: { type: String, require: true },
//     passwordSalt: { type: String, require: true },
//     createdAt: { type: String, require: true },
//   },
//   emailConfirmation: {
//     confirmationCode: { type: String, require: true },
//     expirationDate: { type: Date, require: true },
//     isConfirmed: { type: Boolean, require: true },
//   },
//   passwordUpdate: {
//     resetPasswordCode: { type: String, default: null },
//     expirationDatePasswordCode: { type: Date, default: null },
//   },
// });
