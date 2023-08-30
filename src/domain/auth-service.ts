// import bcrypt from "bcrypt";
// import {ObjectId} from "mongodb";
// import add from 'date-fns/add'
// import {UsersRepository} from "../repositories-db/users-repository-db";
// import {EmailManager} from "../managers/email-manager";
// import {randomUUID} from "crypto";
// import {ClassUserAccountDb, ClassUsersSessionDb} from "../classes/users/users-class";
// import {emailManager} from "../composition-root";
//
// export class AuthService {
//     // usersRepository: UsersRepository
//     // emailManager: EmailManager
//     // constructor() {
//     //     this.usersRepository = new UsersRepository
//     //     this.emailManager = new EmailManager()
//     // }
//     constructor(
//         protected usersRepository: UsersRepository,
//         protected emailManager: EmailManager
//     ) {}
//     async createUserAuth(login: string, password: string, email: string): Promise<ClassUserAccountDb | null> {
//
//         const dateNow = new Date().getTime().toString()
//         const passwordSalt = await bcrypt.genSalt(10)
//         const passwordHash = await this._generateHash(password, passwordSalt)
//
//         const userAccount = new ClassUserAccountDb(
//             new ObjectId(),
//             dateNow,
//             {
//                 userName: {
//                     login: login,
//                     email: email
//                 },
//                 passwordHash,
//                 passwordSalt,
//                 createdAt: new Date().toISOString(),
//             },
//             {
//                 confirmationCode: randomUUID(),
//                 expirationDate: add(new Date(), {
//                     hours: 1
//                 }),
//                 isConfirmed: false
//             },
//             {
//                 resetPasswordCode: null,
//                 expirationDatePasswordCode: new Date()
//             },
//         )
//
//         const createUserAuth = await this.usersRepository.createUserAccount(userAccount)
//
//         await this.emailManager.sendEmailconfirmationMessage(userAccount)
//
//         return createUserAuth
//     }
//     async createSession(sessionId: string, ip: string, title: string,deviceId: string, refreshToken: string): Promise<ClassUsersSessionDb> {
//
//         const userSession = new ClassUsersSessionDb(
//             sessionId,
//             ip,
//             title,
//             deviceId,
//             new Date().toISOString(),
//             refreshToken,
//             new Date(),
//             new Date(Date.now() + 20000)
//         )
//
//         let result = await this.usersRepository.createSessionInDb(userSession)
//         return result
//     }
//     async changeDataInSession(deviceId: string, refreshToken: string): Promise<boolean> {
//
//         let result = await this.usersRepository.changeDataInSessionInDb(deviceId,refreshToken)
//         return result
//     }
//     async deleteSession(deviceId: string): Promise<boolean> {
//
//         let result = await this.usersRepository.deleteSessionInDb(deviceId)
//         return result
//     }
//     async confirmEmail(code: string): Promise<boolean> {
//
//         let user = await this.usersRepository.findUserByConfirmCode(code)
//
//         if (!user) return false
//         if (user.emailConfirmation.isConfirmed) return false
//         if (user.emailConfirmation.confirmationCode !== code) return false
//         if (user.emailConfirmation.expirationDate < new Date()) return false
//
//
//         let result = await this.usersRepository.updateConfirmation(user.id)
//         return result
//     }
//     async _generateHash(password: string, salt: string) {
//         const hash = await bcrypt.hash(password, salt)
//         return hash
//     }
//     async makeNewPasswordByResendingCode(newPassword: string, recoveryCode: string): Promise<boolean> {
//
//         let user = await this.usersRepository.findUserByResetPasswordCode(recoveryCode)
//         if (!user) return false
//         if (user.passwordUpdate.expirationDatePasswordCode < new Date()) return false
//
//         const passwordSalt = await bcrypt.genSalt(10)
//         const passwordHash = await this._generateHash(newPassword, passwordSalt)
//
//         return this.usersRepository.changePasswordInDb(user.id,passwordSalt,passwordHash)
//     }
//     async resendingCode(email: string): Promise<boolean | null> {
//
//         let user = await this.usersRepository.findByAuthLoginEmail(email)
//
//         if (!user) return false
//         if (user.emailConfirmation.isConfirmed) return false
//
//         const confirmationCode = randomUUID()
//
//         await this.usersRepository.chengConfirmationCode(user.id,confirmationCode)
//
//         await this.emailManager.resendEmailconfirmationMessage(email, confirmationCode)
//
//         return true
//     }
//     async resendingPasswordCode(email: string): Promise<boolean | null> {
//
//         let user = await this.usersRepository.findByAuthLoginEmail(email)
//         if (!user) return false
//
//         const NewResetPasswordCode = randomUUID()
//         const NewExpirationDatePasswordCode = add(new Date(), { hours: 24 });
//         await this.usersRepository.changeResetPasswordCode(user.id,NewResetPasswordCode,NewExpirationDatePasswordCode)
//
//         await this.emailManager.resendPasswordCodeMessage(email,NewResetPasswordCode)
//
//         return true
//     }
// }
