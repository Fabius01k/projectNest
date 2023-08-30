// import {emailAdapter} from "../adapters/email-adatper";
// import {UsersRepository} from "../repositories-db/users-repository-db";
// import {ClassUserAccountDb} from "../classes/users/users-class";
//
//
// export class EmailManager {
//     constructor(
//         protected usersRepository: UsersRepository
//     ) {}
//
//     async sendEmailconfirmationMessage(userAccount: ClassUserAccountDb) {
//
//         const userConfirmationCode = userAccount.emailConfirmation.confirmationCode
//
//
//         const email = userAccount.accountData.userName.email
//         const message = `<h1>Thank for your registration</h1>
//         <p>To finish registration please follow the link below:
//             <a href=https://project-nu-silk.vercel.app/registration-confirmation?code=${userConfirmationCode}>complete registration</a>
//         </p>`
//
//         const subject = "Код подтверждения регистрации"
//
//         await emailAdapter.sendEmail(email, subject, message)
//     }
//
//     async resendEmailconfirmationMessage(email: string, code: string) {
//
//         const user = await this.usersRepository.findByAuthLoginEmail(email)
//         const userConfirmationCode = code
//
//         const message = `<h1>Thank for your registration</h1>
//         <p>To finish registration please follow the link below:
//             <a href='https://project-nu-silk.vercel.app/registration-confirmation?code=${userConfirmationCode}'>complete registration</a>
//         </p>`
//         const subject = "Новый код подтверждения регистрации"
//
//         await emailAdapter.sendEmail(email, subject, message)
//     }
//
//     async resendPasswordCodeMessage(email: string, code: string) {
//
//         const refreshPasswordCode = code
//
//         const message = `<h1>Password recovery</h1>
//         <p>To finish registration please follow the link below:
//             <a href='https://project-nu-silk.vercel.app/password-recovery?recoveryCode=${refreshPasswordCode}'>recovery password</a>
//         </p>`
//         const subject = "Код восстановления пароля"
//
//         await emailAdapter.sendEmail(email, subject, message)
//     }
// }
