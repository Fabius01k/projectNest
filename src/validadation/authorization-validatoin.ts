// import {Request, Response, NextFunction} from "express";
// import {sessionsModel} from "../db/db";
// import {jwtService} from "../application/jwt-service";
//
//
// export const basicAuthGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     // Basic YWRtaW46cXdlcnR5
//     const authHeader = req.headers.authorization;
//
//     if (authHeader) {
//         //["Basic", "YWRtaW46cXdlcnR5"]
//         const [authType, authValue] = authHeader.split(' ', 2);
//         if (authType.toLowerCase() === 'basic') {
//             // YWRtaW46cXdlcnR5 => admin:qwerty
//             const [username, password] = Buffer.from(authValue, 'base64').toString().split(':', 2);
//             // [admin, qwerty]
//             if (username === 'admin' && password === 'qwerty') {
//                 return next();
//             }
//         }
//     }
//
//     return res.sendStatus(401)
// };
//
// export const tokenUserValidator = async (req: Request, res: Response, next: NextFunction) => {
//
//     const token = req.cookies.refreshToken
//
//     if (!token && typeof token !== 'string') return res.sendStatus(401)
//
//     const user = await jwtService.getUserIdByToken(token)
//
//     if(!user) return res.sendStatus(401)
//
//
//     const deviceIdInReq = await jwtService.getDeviceIdByToken(token)
//     const creationDateOftoken = await jwtService.getTokenCreationDate(token)
//
//     const userSessionInDb = await sessionsModel.findOne({refreshToken: token})
//     // if(user !== userSessionInDb?.sessionId) return res.sendStatus(401)
//
//         if(deviceIdInReq !== userSessionInDb?.deviceId &&
//         creationDateOftoken !== userSessionInDb?.tokenCreationDate ) return res.sendStatus(401)
//     next()
// }
