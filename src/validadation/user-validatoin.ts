// import {body} from "express-validator";
// import {usersRepository} from "../composition-root";
//
//
// export const userCreateValidators = [
//
//     body('login').isString().notEmpty()
//         .trim().isLength({min:3,max:10})
//         .matches(/^[a-zA-Z0-9_-]*$/)
//         .withMessage('login is not correct')
//         .custom(async v => {const user = await usersRepository.findByAuthLoginEmail(v)
//
//             if (user) {throw new Error('Login already use')
//             } else {
//                 return true
//             }
//         }),
//
//     body('password').isString().notEmpty()
//         .trim()
//         .isLength({min:6,max:20})
//         .withMessage('password is not correct'),
//
//     body('email').isString().notEmpty()
//         .trim()
//         .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
//         .withMessage('email is not correct')
//         .custom(async v => {const user = await usersRepository.findByAuthLoginEmail(v)
//
//             if (user) {throw new Error('Email already use')
//             } else {
//                 return true
//             }
//         }),
// ]
//
// export const userAuthCreateValidators = [
//
//     body('login').isString().notEmpty()
//         .trim().isLength({min:3,max:10})
//         .matches(/^[a-zA-Z0-9_-]*$/)
//         .withMessage('login is not correct')
//         .custom(async v => {const user = await usersRepository.findByAuthLoginEmail(v)
//
//             if (user) {throw new Error('Login already use')
//             } else {
//                 return true
//             }
//         }),
//
//     body('password').isString().notEmpty()
//         .trim()
//         .isLength({min:6,max:20})
//         .withMessage('password is not correct'),
//
//     body('email').isString().notEmpty()
//         .trim()
//         .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
//         .withMessage('email is not correct')
//         .custom(async v => {const user = await usersRepository.findByAuthLoginEmail(v)
//
//             if (user) {throw new Error('Email already use')
//             } else {
//                 return true
//             }
//         }),
// ]
