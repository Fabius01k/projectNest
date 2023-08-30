// import {videosModel} from "../db/db";
// import {TVideoView} from "../models/videos/videos-type";
// import {ObjectId} from "mongodb";
// import {ClassVideoDb} from "../classes/videos/videos-class";
//
// export let videos: ClassVideoDb[] = []
// const mapVideoFromDbToView = (video:ClassVideoDb): TVideoView => {
//     return {
//         id: video.id,
//         title: video.title,
//         author: video.author,
//         canBeDownloaded: video.canBeDownloaded,
//         minAgeRestriction: video.minAgeRestriction,
//         createdAt: video.createdAt,
//         publicationDate: video.publicationDate,
//         availableResolutions: video.availableResolutions
//     }
// }
//
// export class VideosRepository {
//     async findVideos(): Promise<TVideoView[]> {
//         const videos: ClassVideoDb[] = await videosModel.find().lean();
//         return videos.map(v => mapVideoFromDbToView(v))
//     }
//     async createVideo(newVideo: ClassVideoDb): Promise<TVideoView> {
//         await videosModel.insertMany([newVideo]);
//
//         return mapVideoFromDbToView(newVideo);
//     }
//     async getVideoById(id: number): Promise<TVideoView | null> {
//         const video: ClassVideoDb | null = await videosModel.findOne({id: id})
//         if (!video) return null
//
//         return mapVideoFromDbToView(video)
//     }
//     async updateVideo(id: number, title: string, author: string,
//                       availableResolutions: string[], canBeDownloaded: boolean,
//                       minAgeRestriction: number | null,
//                       publicationDate: string): Promise<boolean> {
//
//         const updateVideo = await videosModel.
//         updateOne({id: id}, {
//             $set: {
//                 title: title,
//                 author: author,
//                 availableResolutions: availableResolutions,
//                 canBeDownloaded: canBeDownloaded,
//                 minAgeRestriction: minAgeRestriction,
//                 publicationDate: publicationDate,
//             },
//         })
//
//         const video = updateVideo.matchedCount === 1
//         return video
//     }
//     async deleteVideo(id: number): Promise<boolean> {
//         const deleteVideo = await videosModel.
//         deleteOne({id: id})
//
//         return deleteVideo.deletedCount === 1
//     }
// }
