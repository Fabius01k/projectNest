//
// type TVideo = {
//     id: number
//     title: string
//     author: string
//     canBeDownloaded: boolean
//     minAgeRestriction: number | null
//     createdAt: string
//     publicationDate: string
//     availableResolutions: string[]
// }
// const valueAvailableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
// const valuePublicationDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/
//
//  export let videos: TVideo[] = []
//
//
// export const videosRepository = {
//
//
//     async findVideos() {
//             return Promise.resolve(videos)
//     },
//
//     async createVideo(title: string, author: string, availableResolutions: string[]) {
//
//
//         const dateNow = new Date()
//         const newVideo: TVideo = {
//             id: +dateNow,
//             title: title,
//             author: author,
//             canBeDownloaded: false,
//             minAgeRestriction: null,
//             createdAt: dateNow.toISOString(),
//             publicationDate: new Date(+dateNow + (1000 * 60 * 60 * 24)).toISOString(),
//             availableResolutions: availableResolutions
//         }
//         videos.push(newVideo)
//         return Promise.resolve(newVideo)
//
//     },
//
//     async getVideoById(id: number) {
//         const video = videos.find(v => v.id === id)
//         return Promise.resolve(video)
//     },
//
//     async updateVideo(id: number, title: string, author: string,
//                 availableResolutions: string[], canBeDownloaded: boolean,
//                 minAgeRestriction: number | null,
//                 publicationDate: string) {
//
//         const video = videos.find(v => v.id === id)
//
//         if (video) {
//
//             video.title = title
//             video.author = author
//             video.availableResolutions = availableResolutions
//             video.canBeDownloaded = canBeDownloaded
//             video.minAgeRestriction = minAgeRestriction
//             video.publicationDate = publicationDate
//             return Promise.resolve(video)
//
//
//         }
//     },
//
//     async deleteVideo(id: number) {
//         return new Promise((resolve, reject) => {
//         for (let i = 0; i < videos.length; i++) {
//             if (videos[i].id === id) {
//                 videos.splice(i, 1)
//                 resolve(true)
//             }
//         }
//             resolve(false)
//     })
//
//     }
// }
