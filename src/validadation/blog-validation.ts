// import {body} from "express-validator";
//
// export const blogCreateValidators = [
//
//     body('name').isString().notEmpty().
//     trim().isLength({min:1,max:15}).withMessage('name is not correct'),
//
//     body('description').isString().trim().notEmpty().isLength({min:1,max:500}).        //bail()
//     withMessage('description is not correct'),
//
//     body('websiteUrl').isString().trim().notEmpty().isLength({min:1,max:100}).
//     matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).
//     withMessage('websiteUrl is not correct'),
// ]
//
// export const blogUpdateValidators = [
//
//     body('name').isString().notEmpty().
//     trim().isLength({min:1,max:15}).withMessage('name is not correct'),
//
//     body('description').isString().trim().notEmpty().isLength({min:1,max:500}).
//     withMessage('description is not correct'),
//
//     body('websiteUrl').isString().trim().notEmpty().isLength({min:1,max:100}).
//     matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).
//     withMessage('websiteUrl is not correct'),
// ]
