// import {VideosService} from "../../domain/videos-servise";
// import {Request, Response} from "express";
//
// const valueAvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
// const valuePublicationDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/
//
// export class VideosController {
//     constructor(
//         protected videosService: VideosService
//     ) {}
//     async createVideo(req: Request, res: Response) {
//         const title = req.body.title
//         const author = req.body.author
//         const availableResolutions = req.body.availableResolutions
//         const errors = []
//
//         if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
//             errors.push({
//                 message: "invalid title",
//                 field: "title"
//             })
//         }
//
//         if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
//             errors.push({
//                 message: "invalid author",
//                 field: "author"
//             })
//         }
//
//         if (!availableResolutions || availableResolutions.length > valueAvailableResolutions.length) {
//             errors.push({
//                 message: "invalid availableResolutions",
//                 field: "availableResolutions"
//
//             })
//
//         }
//
//         if (availableResolutions !== undefined && availableResolutions !== null) {
//             const valueAvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
//             for (let i = 0; i < availableResolutions.length; i++) {
//                 if (!valueAvailableResolutions.includes(availableResolutions[i])) {
//                     errors.push({
//                         message: "invalid title",
//                         field: "availableResolutions"
//
//                     });
//                     break;
//
//                 }
//             }
//         }
//         if (errors.length > 0) {
//             res.status(400).send({errorsMessages: errors})
//             return
//         }
//         const newVideo = await this.videosService.createVideo(req.body.title, req.body.author, req.body.availableResolutions)
//         res.status(201).send(newVideo)
//     }
//     async updateVideo(req: Request, res: Response) {
//         const title = req.body.title
//         const author = req.body.author
//         const availableResolutions = req.body.availableResolutions
//         const canBeDownloaded = req.body.canBeDownloaded
//         const minAgeRestriction = req.body.minAgeRestriction
//         const publicationDate = req.body.publicationDate
//         const errors = []
//
//
//         if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
//             errors.push({
//                 message: "invalid title",
//                 field: "title"
//             })
//
//         }
//
//         if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
//             errors.push({
//                 message: "invalid author",
//                 field: "author"
//             })
//
//         }
//
//         if (!availableResolutions) {
//             errors.push({
//                 message: "invalid availableResolutions",
//                 field: "availableResolutions"
//
//             })
//
//         }
//         if (availableResolutions !== undefined && availableResolutions !== null) {
//             const valueAvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
//             for (let i = 0; i < availableResolutions.length; i++) {
//                 if (!valueAvailableResolutions.includes(availableResolutions[i])) {
//                     errors.push({
//                         message: "invalid title",
//                         field: "availableResolutions"
//
//                     });
//                     break;
//                 }
//             }
//         }
//
//         if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
//             errors.push({
//                 message: "net",
//                 field: "canBeDownloaded"
//             })
//         }
//
//         if (typeof minAgeRestriction !== "undefined") {
//             if (!Number.isInteger(minAgeRestriction)) {
//                 errors.push({
//                     message: "minAgeRestriction must be an integer",
//                     field: "minAgeRestriction"
//                 })
//
//                 return;
//             }
//
//             if (minAgeRestriction < 1 || minAgeRestriction > 18) {
//                 errors.push({
//                     message: "minAgeRestriction must be greater than 1 and less than or equal to 18",
//                     field: "minAgeRestriction"
//                 })
//             }
//         }
//
//         if (!valuePublicationDate.test(publicationDate)) {
//             errors.push({
//                 message: "invalid date format",
//                 field: "publicationDate"
//             })
//         }
//
//         if (errors.length > 0) {
//             return res.status(400).send({errorsMessages: errors})
//
//         }
//         const id = +req.params.id
//         const video = await this.videosService.updateVideo(
//             +req.params.id,
//             req.body.title,
//             req.body.author,
//             req.body.availableResolutions,
//             req.body.canBeDownloaded,
//             req.body.minAgeRestriction,
//             req.body.publicationDate)
//
//         if (video) {
//             res.status(204).send(video)
//         } else {
//             res.sendStatus(404)
//         }
//     }
//     async getAllVideos(req: Request, res: Response) {
//         const videos = await this.videosService.findVideos()
//         res.status(200).send(videos)
//     }
//     async getVideoById(req: Request, res: Response) {
//         const id = +req.params.id
//         const video = await this.videosService.getVideoById(+req.params.id)
//
//         if (video) {
//             res.status(200).send(video)
//         } else {
//             res.sendStatus(404)
//         }
//     }
//     async deleteVideo(req: Request, res: Response) {
//         const id = +req.params.id
//         const newVideos = await this.videosService.deleteVideo(+req.params.id)
//
//         if (newVideos) {
//             res.sendStatus(204)
//         } else {
//             res.sendStatus(404)
//         }
//     }
// }
