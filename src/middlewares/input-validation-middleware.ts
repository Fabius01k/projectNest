// import {Request, Response, NextFunction} from "express";
// import {validationResult} from "express-validator";
//
//
// export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const errorsMessages = validationResult(req);
//     if (!errorsMessages.isEmpty()) {
//         const errors = errorsMessages.array({onlyFirstError: true})
//         return res.status(400).json({errorsMessages: errors.map(e => ({message: e.msg, field: e.param}))});
//     } else {
//         next()
//     }
// }
