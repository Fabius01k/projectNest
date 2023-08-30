// import {SecurityRepository} from "../repositories-db/security-repository-db";
// import {ClassNewDocumentToAppFromUser, ClassUsersSessionDb} from "../classes/users/users-class";
// import {UsersSessionView} from "../models/user-account/user-account-types";
//
// export class SecurityService {
//     constructor(
//         protected securityRepository:SecurityRepository
//     ) {}
//
//     async getUserSessions(sessionId: string): Promise<UsersSessionView[]> {
//
//         return this.securityRepository.getUserSessions(sessionId)
//     }
//     async deleteOtherSessions(sessionId: string, deviceId: string): Promise<boolean> {
//
//         let result = await this.securityRepository.deleteOtherSessionsInDb(sessionId,deviceId)
//         return result
//     }
//     async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
//
//         let result = await this.securityRepository.deleteSessionByDeviceIdInDb(deviceId)
//         return result
//     }
//     async addDocumentInCollection(ip: string, url: string, date: Date): Promise<ClassNewDocumentToAppFromUser> {
//         const documentForCount = new ClassNewDocumentToAppFromUser(
//             ip,
//             url,
//             date
//         )
//
//         let result: ClassNewDocumentToAppFromUser = await this.securityRepository.addDocumentInCollectionDb(documentForCount)
//         return result
//     }
//     async getDocumentCount(ip: string, url: string, tenSecondsAgo: Date): Promise<number> {
//         const count = await this.securityRepository.countDocumentsInDb(ip, url, tenSecondsAgo);
//         return count;
//     }
// }
