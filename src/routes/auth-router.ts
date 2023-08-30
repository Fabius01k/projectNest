// import {Request, Response, Router} from "express";
// import {UsersService} from "../domain/users-service";
// import {jwtService} from "../application/jwt-service";
// import {authMiddleware} from "../middlewares/auth-middleware";
// import {WithId} from "mongodb";
// import {AuthService} from "../domain/auth-service";
// import {userAuthCreateValidators} from "../validadation/user-validatoin";
// import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
// import {
//     emailCodeResendingValidator,
//     emailPasswordResendingValidator, PasswordResendingCodeValidator,
//     registrationCodeValidator
// } from "../validadation/registration-validation";
// import {randomUUID} from "crypto";
// import {tokenUserValidator} from "../validadation/authorization-validatoin";
// import {v4 as uuid} from "uuid";
// import {rateLimitMiddleware} from "../middlewares/rate-limitmiddleware";
// import {ClassUserAccountDb} from "../classes/users/users-class";
// import {authController} from "../composition-root";
//
//
// export const authRouter = Router({})
//
//
//
// authRouter.get('/me', authMiddleware,
//     authController.getInformationForUser.bind(authController))
//
// authRouter.post('/login', rateLimitMiddleware,
//     authController.loginUser.bind(authController))
//
// authRouter.post('/refresh-token', tokenUserValidator,
//     authController.genereteNewTokensForUser.bind(authController))
//
// authRouter.post('/logout', tokenUserValidator,
//     authController.logoutUser.bind(authController))
//
// authRouter.post('/registration', rateLimitMiddleware, userAuthCreateValidators, inputValidationMiddleware,
//     authController.registrationUser.bind(authController))
//
// authRouter.post('/registration-confirmation', rateLimitMiddleware, registrationCodeValidator, inputValidationMiddleware,
//     authController.registrationConfirmationUser.bind(authController))
//
// authRouter.post('/registration-email-resending', rateLimitMiddleware, emailCodeResendingValidator,
//     inputValidationMiddleware,
//     authController.resendingRegistrationCode.bind(authController))
//
// authRouter.post('/new-password', rateLimitMiddleware, PasswordResendingCodeValidator,
//     inputValidationMiddleware,
//     authController.recoverPasswordForUser.bind(authController))
//
// authRouter.post('/password-recovery', rateLimitMiddleware, emailPasswordResendingValidator,
//     inputValidationMiddleware,
//     authController.sendRecoveryCodeForUser.bind(authController))


