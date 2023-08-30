// import {body} from "express-validator";
//
// export const commentUpdateValidation = [
//     body('content')
//         .isString()
//         .notEmpty()
//         .trim()
//         .isLength({min:20,max:300}).withMessage('content is not correct'),
// ]
//
//
// export const commentCreateByPostValidation = [
//     body('content')
//         .isString()
//         .notEmpty()
//         .trim()
//         .isLength({min:20,max:300}).withMessage('content is not correct'),
// ]
//
// export const LikeInfoStatusValidator = [
//     body('likeStatus')
//         .isString()
//         .notEmpty()
//         .trim()
//         .isIn(['None', 'Like', 'Dislike'])
//         .withMessage('Invalid likeStatus value'),
// ]
