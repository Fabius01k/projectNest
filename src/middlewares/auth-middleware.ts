// import {NextFunction} from "express";
// import {Request, Response} from "express";
// import {jwtService} from "../application/jwt-service";
// import {UsersService} from "../domain/users-service";
// import {ObjectId} from "mongodb";
// import {usersService} from "../composition-root";
//
// export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//
//     if (!req.headers.authorization) return  res.sendStatus(401);
//
//     const token = req.headers.authorization.split(' ')[1]
//     const userId = await jwtService.getUserIdByToken(token)
//
//     if(!userId) return res.sendStatus(401);
//
//     const foundUser =  await usersService.findUserById(userId)
//     //if(!foundUser)=> 401
//     req.userId = foundUser?.id
//     next()
// }
// export class AuthMiddleware {
//     usersService: UsersService
//     constructor() {
//         this.usersService = new UsersService()
//     }
//
//     async handle(req: Request, res: Response, next: NextFunction) {
//         if (!req.headers.authorization) return res.sendStatus(401);
//
//         const token = req.headers.authorization.split(' ')[1]
//         const userId = await jwtService.getUserIdByToken(token)
//
//         if (!userId) return res.sendStatus(401);
//
//         const foundUser = await this.usersService.findUserById(userId)
//         //if(!foundUser)=> 401
//         req.userId = foundUser?.id
//         next()
//     }
// }
