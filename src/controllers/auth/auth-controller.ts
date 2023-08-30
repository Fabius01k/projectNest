// import {UsersService} from "../../domain/users-service";
// import {AuthService} from "../../domain/auth-service";
// import {Request, Response} from "express";
// import {jwtService} from "../../application/jwt-service";
// import {WithId} from "mongodb";
// import {ClassUserAccountDb} from "../../classes/users/users-class";
// import {randomUUID} from "crypto";
//
//
// export class AuthController {
//     constructor(
//         protected usersService: UsersService,
//         protected authService: AuthService
//     ) {}
//     async getInformationForUser(req: Request, res: Response) {
//
//         const token = req.headers.authorization!.split(' ')[1]
//
//         const userId = await jwtService.getUserIdByToken(token)
//         const authUser = await this.usersService.findAuthUser(userId)
//
//         if (!authUser) return res.sendStatus(401);
//
//         return res.status(200).send({
//             email: authUser.email, login: authUser.login, userId: authUser.id
//         });
//     }
//     async loginUser(req: Request, res: Response) {
//         const user: WithId<ClassUserAccountDb> | null = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
//
//         if (user) {
//             const accessToken = await jwtService.createAccessJWT(user.id)
//             const refreshTokenPayload = {
//                 deviceId: randomUUID(),
//             }
//             const refreshToken = await jwtService.createRefreshJWT(user.id, refreshTokenPayload)
//
//             const sessionId = user.id
//             const ip = req.ip
//             const title = req.headers['user-agent'] || 'Unknown'
//
//             await this.authService.createSession(sessionId, ip, title, refreshTokenPayload.deviceId, refreshToken)
//
//             res.cookie('refreshToken', refreshToken, {
//                 httpOnly: true,
//                 secure: true,
//                 maxAge: 20 * 1000,
//             })
//
//             return res.status(200).send({accessToken});
//         } else {
//             return res.sendStatus(401)
//         }
//     }
//     async genereteNewTokensForUser(req: Request, res: Response) {
//
//         const token = req.cookies.refreshToken
//
//         const userForResend = await jwtService.getUserIdByToken(token)
//
//         const accessToken = await jwtService.createAccessJWT(userForResend)
//         const oldDeviceID = await jwtService.getDeviceIdByToken(token)
//
//         const refreshTokenPayload = {
//             deviceId: oldDeviceID,
//         }
//         const refreshToken = await jwtService.createRefreshJWT(userForResend, refreshTokenPayload)
//
//         await this.authService.changeDataInSession(oldDeviceID, refreshToken)
//
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: true,
//             maxAge: 20 * 1000,
//         })
//
//         return res.status(200).send({accessToken})
//     }
//     async logoutUser(req: Request, res: Response) {
//
//         const token = req.cookies.refreshToken
//
//         const deviceId = await jwtService.getDeviceIdByToken(token)
//
//         await this.authService.deleteSession(deviceId)
//
//         res.clearCookie('refreshToken')
//         return res.sendStatus(204)
//     }
//     async registrationUser(req: Request, res: Response) {
//         const user = await this.authService.createUserAuth(req.body.login, req.body.password, req.body.email)
//         if (user) {
//             res.status(204).send()
//         } else {
//             res.sendStatus(400)
//         }
//     }
//     async registrationConfirmationUser(req: Request, res: Response) {
//
//         const result = await this.authService.confirmEmail(req.body.code)
//         if (result) {
//             res.status(204).send()
//         } else {
//             res.sendStatus(400)
//         }
//     }
//     async resendingRegistrationCode(req: Request, res: Response) {
//
//         const result = await this.authService.resendingCode(req.body.email)
//         if (result) {
//             res.status(204).send()
//         } else {
//             res.sendStatus(400)
//         }
//     }
//     async recoverPasswordForUser(req: Request, res: Response) {
//         const result = await this.authService.makeNewPasswordByResendingCode(req.body.newPassword, req.body.recoveryCode)
//         if (result) {
//             res.status(204).send()
//         } else {
//             res.sendStatus(400)
//         }
//     }
//     async sendRecoveryCodeForUser(req: Request, res: Response) {
//
//         await this.authService.resendingPasswordCode(req.body.email)
//         return res.sendStatus(204)
//     }
// }
