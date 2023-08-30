// import {TVideoView} from "../models/videos/videos-type";
// import {ObjectId} from "mongodb";
// import {VideosRepository} from "../repositories-db/videos-repositories-db";
// import {ClassVideoDb} from "../classes/videos/videos-class";
//
// export let videos: ClassVideoDb[] = []
// export class VideosService {
//     constructor(
//         protected videosRepository:VideosRepository
//     ) {}
//
//     async findVideos(): Promise<TVideoView[]> {
//         return this.videosRepository.findVideos()
//     }
//     async createVideo(title: string, author: string, availableResolutions: string[]): Promise<TVideoView> {
//
//         const dateNow = new Date()
//         const newVideo = new ClassVideoDb(
//             new ObjectId(),
//             +dateNow,
//             title,
//             author,
//             false,
//             null,
//             dateNow.toISOString(),
//             new Date(+dateNow + (1000 * 60 * 60 * 24)).toISOString(),
//             availableResolutions
//         )
//
//         const createdVideoService = await this.videosRepository.createVideo(newVideo)
//
//         return createdVideoService;
//     }
//     async getVideoById(id: number): Promise<TVideoView | null> {
//         return this.videosRepository.getVideoById(id)
//     }
//     async updateVideo(id: number, title: string, author: string,
//                       availableResolutions: string[], canBeDownloaded: boolean,
//                       minAgeRestriction: number | null,
//                       publicationDate: string): Promise<boolean> {
//         return await this.videosRepository.updateVideo(id,title,author,availableResolutions,
//             canBeDownloaded,minAgeRestriction,publicationDate)
//     }
//     async deleteVideo(id: number): Promise<boolean> {
//         return await this.videosRepository.deleteVideo(id)
//     }
// }
