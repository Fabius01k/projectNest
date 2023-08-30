// import {body} from "express-validator";
// import {userModel} from "../db/db";
//
//
// export const registrationCodeValidator = [
//
//     body('code')
//         .isString()
//         .notEmpty()
//         .custom(async (value: string) => {
//             const user = await userModel.findOne({"emailConfirmation.confirmationCode": value})
//
//             if (!user) {
//                 throw new Error('user doesn`t exist');
//             }
//
//             if (user && user.emailConfirmation.isConfirmed) {
//                 throw new Error('user already confirmed');
//             }
//         })
// ]
//
// export const emailCodeResendingValidator = [
//
//     body('email')
//         .isString()
//         .notEmpty()
//         .custom(async (value: string) => {
//             const user = await userModel.findOne({"accountData.userName.email": value})
//
//             if (!user) {
//                 throw new Error('user doesn`t exist');
//             }
//
//             if (user && user.emailConfirmation.isConfirmed) {
//                 throw new Error('user already confirmed');
//             }
//         })
// ]
//
// export const emailPasswordResendingValidator = [
//     body('email').isString()
//         .notEmpty()
//         .isEmail()
//         // .custom(async (value: string) => {
//         //     const user = await userModel.findOne({"accountData.userName.email": value})
//         //
//         //     if (!user) {
//         //         throw new Error('user doesn`t exist');
//         //     }
//         // })
// ]
//
//
// export const PasswordResendingCodeValidator = [
//     body('recoveryCode')
//         .isString()
//         .notEmpty()
//         .custom(async (value: string) => {
//             const user = await userModel.findOne({"passwordUpdate.resetPasswordCode": value})
//             if (!user) {
//                 throw new Error('user doesn`t exist');
//             }
//             return true
//         }),
//
//     body('newPassword')
//         .isString()
//         .notEmpty()
//         .isLength({min: 6, max: 20})
//         .withMessage('password is not correct'),
// ]
