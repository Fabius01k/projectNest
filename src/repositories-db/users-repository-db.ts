// import {TUserView} from "../models/users/users-type";
// import {sessionsModel, userModel} from "../db/db";
// import {v4 as uuid} from 'uuid'
// import {ClassUserAccountDb, ClassUsersSessionDb} from "../classes/users/users-class";
//
// export let users: ClassUserAccountDb[] = []
// const mapUserFromDbView = (user: ClassUserAccountDb): TUserView => {
//     return {
//         id: user.id,
//         login: user.accountData.userName.login,
//         email: user.accountData.userName.email,
//         createdAt: user.accountData.createdAt
//     }
// }
//
// export class UsersRepository {
//     async findUsers(sortBy: string, sortDirection: 'asc' | 'desc',
//                     pageSize: number, pageNumber: number,
//                     searchLoginTerm: string | null,
//                     searchEmailTerm: string | null) {
//
//         console.log(searchLoginTerm, searchEmailTerm)
//         const filter = {
//             $or: [
//                 {'accountData.userName.login': {$regex: searchLoginTerm ?? '', $options: 'i'}},
//                 {'accountData.userName.email': {$regex: searchEmailTerm ?? '', $options: 'i'}},
//             ]
//         }
//
//         /*const filters: FilterQuery<UserDatabaseType>[] = [];
//
//         if (pagination.searchEmailTerm) {
//             filters.push(
//                 {
//                     email: { $regex: pagination.searchEmailTerm, $options: 'i' }
//                 }
//             )
//         }
//
//         if (pagination.searchLoginTerm) {
//             filters.push(
//                 {
//                     login: { $regex: pagination.searchLoginTerm, $options: 'i' }
//                 }
//             )
//         }
//
//         const filter: FilterQuery<UserDatabaseType> = {};
//
//         if (filters.length > 0) {
//             filter.$or = filters;
//         }*/
//
//         const users: ClassUserAccountDb[] = await userModel
//             .find(filter)
//             // .sort(sortBy, sortDirection)
//             .sort({sortBy: sortDirection})
//             .skip((pageNumber - 1) * pageSize)
//             .limit(pageSize)
//             .lean()
//
//         console.log('users', users)
//         const items = users.map(u => mapUserFromDbView(u))
//         const totalCount = await userModel.countDocuments(filter)
//
//         return {
//             pagesCount: Math.ceil(totalCount / pageSize),
//             page: +pageNumber,
//             pageSize: +pageSize,
//             totalCount: totalCount,
//             items: items
//         }
//     }
//     async findAuthUser(id: string): Promise<TUserView | null> {
//         const authUser: ClassUserAccountDb | null = await userModel.findOne({id: id})
//         if (!authUser) return null
//
//         return mapUserFromDbView(authUser)
//     }
//     async getUserById(id: string): Promise<TUserView | null> {
//         const user: ClassUserAccountDb | null = await userModel.findOne({id: id})
//         if (!user) return null
//
//         return mapUserFromDbView(user)
//     }
//     async createUser(newUser: ClassUserAccountDb): Promise<TUserView | null> {
//         await userModel.insertMany([newUser])
//
//         return mapUserFromDbView(newUser)
//     }
//     async createUserAccount(userAccount: ClassUserAccountDb): Promise<ClassUserAccountDb | null> {
//         await userModel.insertMany([userAccount])
//         return userAccount
//     }
//     async deleteUser(id: string): Promise<boolean> {
//         const deleteUser = await userModel
//             .deleteOne({id: id})
//
//         return deleteUser.deletedCount === 1
//     }
//
//     // async findByLoginEmail(loginOrEmail: string) {
//     //
//     //     const user = await usersAccountCollection.findOne({ $or: [{ email:loginOrEmail}, { login: loginOrEmail} ]})
//     //     return user
//     // },
//
//     async findByAuthLoginEmail(loginOrEmail: string) {
//
//         const user = await userModel.findOne({$or: [{"accountData.userName.email": loginOrEmail}, {"accountData.userName.login": loginOrEmail}]})
//         return user
//     }
//     async findUserByConfirmCode(emailConfirmationCode: string) {
//
//         const user = await userModel.findOne({"emailConfirmation.confirmationCode": emailConfirmationCode})
//         return user
//     }
//     async findUserByResetPasswordCode(recoveryCode: string) {
//         const user = await userModel.findOne({"passwordUpdate.resetPasswordCode": recoveryCode})
//         return user
//     }
//     async findUserById(id: string) {
//         const user = await userModel.findOne({id: id})
//         return user
//     }
//
//     async updateConfirmation(id: string) {
//         let result = await userModel
//             .updateOne({id}, {$set: {'emailConfirmation.isConfirmed': true}})
//
//         return result.modifiedCount === 1
//     }
//     async chengConfirmationCode(id: string, confirmationCode: string) {
//         let result = await userModel
//             .updateOne({id}, {$set: {'emailConfirmation.confirmationCode': confirmationCode}})
//
//         return result.modifiedCount === 1
//     }
//     async changeResetPasswordCode(id: string, NewResetPasswordCode: string,
//                                   NewExpirationDatePasswordCode: Date) {
//         let result = await userModel
//             .updateOne({id}, {
//                 $set: {
//                     'passwordUpdate.resetPasswordCode': NewResetPasswordCode,
//                     'passwordUpdate.expirationDatePasswordCode': NewExpirationDatePasswordCode
//                 }
//             })
//
//         return result.modifiedCount === 1
//     }
//     async changePasswordInDb(id: string, passwordSalt: string, passwordHash: string) {
//         let result = await userModel
//             .updateOne({id}, {
//                 $set: {
//                     'accountData.passwordSalt': passwordSalt,
//                     'accountData.passwordHash': passwordHash
//                 }
//             })
//
//         return result.modifiedCount === 1
//     }
//     async createSessionInDb(userSession: ClassUsersSessionDb): Promise<ClassUsersSessionDb> {
//         let result = await sessionsModel
//             .insertMany([userSession])
//         return userSession
//     }
//     async changeDataInSessionInDb(deviceId: string, refreshToken: string) {
//         let result = await sessionsModel
//             .updateOne({deviceId}, {
//                 $set: {
//                     refreshToken: refreshToken,
//                     lastActiveDate: new Date().toISOString(),
//                     tokenCreationDate: new Date(),
//                     tokenExpirationDate: new Date(Date.now() + 20000)
//                 }
//             })
//
//         return result.modifiedCount === 1
//     }
//
//     // async addTokenInBlackListDb(userForResend: string,token: string ) {
//     //     const userId = userForResend
//     //
//     //     let result = await usersAccountTokenColletion
//     //         .updateOne({ userId },
//     //             {$push: { usedRefreshToken: token }})
//     //
//     //     return result.modifiedCount === 1
//     // },
//
//     async deleteSessionInDb(deviceId: string) {
//         let result = await sessionsModel.deleteOne({deviceId});
//         return result.deletedCount === 1;
//     }
//
// }
