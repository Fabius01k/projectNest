// import {SecurityService} from "../../domain/security-service";
// import {Request, Response} from "express";
// import {jwtService} from "../../application/jwt-service";
// import {UsersSessionView} from "../../models/user-account/user-account-types";
//
//
// export class SecurityController {
//     constructor(
//         protected securityService:SecurityService
//     ) {}
//     async getAllActiveUsersSession(req: Request, res: Response) {
//         const token = req.cookies.refreshToken
//         const sessionId = await jwtService.getUserIdByToken(token)
//         const sessionOfUser: UsersSessionView[] = await this.securityService.getUserSessions(sessionId)
//
//         res.status(200).send(sessionOfUser)
//     }
//     async deleteAllOthersSessions(req: Request, res: Response) {
//         const token = req.cookies.refreshToken
//         const sessionId = await jwtService.getUserIdByToken(token)
//
//         const deviceId = await jwtService.getDeviceIdByToken(token)
//
//         await this.securityService.deleteOtherSessions(sessionId, deviceId)
//
//         return res.sendStatus(204)
//     }
//     async deleteSessionById(req: Request, res: Response) {
//         const deviceId = req.params.deviceId
//
//         await this.securityService.deleteSessionByDeviceId(deviceId)
//
//         return res.sendStatus(204)
//     }
// }
