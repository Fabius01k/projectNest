// import {ObjectId} from "mongodb";
//
//
// export class ClassUserAccountDb {
//     constructor(
//     public _id: ObjectId,
//     public id: string,
//     public accountData: {
//         userName: {
//             login: string,
//             email: string
//         },
//         passwordHash: string
//         passwordSalt: string
//         createdAt: string
//     },
//     public emailConfirmation: {
//         confirmationCode: string,
//         expirationDate: Date
//         isConfirmed: boolean
//     },
//     public passwordUpdate: {
//         resetPasswordCode: string | null
//         expirationDatePasswordCode: Date
//     },
//     ) {}
// }
//
// export class ClassUsersSessionDb {
//     constructor(
//         public sessionId: string,
//         public ip: string,
//         public title: string,
//         public deviceId: string,
//         public lastActiveDate: string,
//         public refreshToken: string,
//         public tokenCreationDate: Date,
//         public tokenExpirationDate: Date,
//     ) {}
// }
//
// export class ClassNewDocumentToAppFromUser {
//     constructor(
//     public ip: string,
//     public url: string,
//     public date: Date | { $gte: Date },
//     ) {}
// }
