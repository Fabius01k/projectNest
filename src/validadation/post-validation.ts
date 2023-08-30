// import {body} from "express-validator";
// import {blogsModel} from "../db/db";
//
//
// export const postCreateValidators = [
//     body('blogId').isString().notEmpty().custom(async (value: string) => {
//         const blog = await blogsModel.findOne({id: value})
//
//         if (!blog) {
//             throw new Error(' 1 Blog ID is not valid');
//         } else {
//             return true
//         }
//     }),
//     body('title').isString().notEmpty().trim().isLength({min: 1, max: 30}).withMessage('title is not correct'),
//
//     body('shortDescription').isString().notEmpty().trim().isLength({
//         min: 1,
//         max: 100
//     }).withMessage('shortDescription is not correct'),
//
//     body('content').isString().notEmpty().trim().isLength({min: 1, max: 1000}).withMessage('content is not correct'),
// ]
//
// export const postCreateByBlogValidator = [
//     body('title').isString().notEmpty().trim().isLength({min: 1, max: 30}).withMessage('title is not correct'),
//
//     body('shortDescription').isString().notEmpty().trim().isLength({
//         min: 1,
//         max: 100
//     }).withMessage('shortDescription is not correct'),
//
//     body('content').isString().notEmpty().trim().isLength({min: 1, max: 1000}).withMessage('content is not correct'),
// ]
//
// export const postUpdateValodators = [
//     body('title').isString().notEmpty().trim().isLength({min: 1, max: 30}).withMessage('title is not correct'),
//
//     body('shortDescription').isString().notEmpty().trim().isLength({
//         min: 1,
//         max: 100
//     }).withMessage('shortDescription is not correct'),
//
//     body('content').isString().notEmpty().trim().isLength({min: 1, max: 1000}).withMessage('content is not correct'),
//
//     body('blogId').isString().notEmpty().custom(async (value: string) => {
//         const blog = await blogsModel.findOne({id: value})
//         // const blog = blogs.find(blog => blog.id === value)
//         if (!blog) {
//             throw new Error('2 Blog ID is not valid');
//         }
//         return true
//     }),
// ]
