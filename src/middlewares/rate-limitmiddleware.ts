// import {NextFunction, Request, Response} from "express";
// import {securityService} from "../composition-root";
//
//
// export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//
//     const ip = req.ip
//     const url = req.url
//     const date = new Date()
//     const tenSecondsAgo = new Date(date.getTime() - 10000);
//
//     await securityService.addDocumentInCollection(ip,url,date)
//
//     const count: number = await securityService.getDocumentCount(ip, url, tenSecondsAgo);
//
//     if (count > 5) return res.sendStatus(429);
//
//     next()
// }
