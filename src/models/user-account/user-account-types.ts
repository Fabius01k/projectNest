// import {ObjectId} from "mongodb";

//     export type TUserAccountDb = {
//     _id?: ObjectId
//     id: string
//     accountData: {
//         userName: {
//             login: string,
//             email: string
//         },
//         passwordHash: string
//         passwordSalt: string
//         createdAt: string
//     },
//     emailConfirmation: {
//         confirmationCode: string,
//         expirationDate: Date
//         isConfirmed: boolean
//     },
//         passwordUpdate: {
//             resetPasswordCode: string | null
//             expirationDatePasswordCode: Date
//         },
// }

// export type UsersSessionDb = {
//         sessionId: string
//         ip: string
//         title: string
//         deviceId: string
//         lastActiveDate: string
//         refreshToken: string
//         tokenCreationDate: Date
//         tokenExpirationDate: Date
//     }

// export type UsersSessionView = {
//         ip: string
//         title: string
//         lastActiveDate: string
//         deviceId: string
// }

// export type NewDocumentToAppFromUser = {
//         ip: string
//         url: string
//         date: Date | { $gte: Date }
//     }
