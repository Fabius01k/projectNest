// import {UsersService} from "../../domain/users-service";
// import {Request, Response} from "express";
//
//
// export class UsersController {
//     constructor(
//         protected usersService: UsersService
//     ) {}
//     async getAllUsers(req: Request, res: Response) {
//
//         let searchLoginTerm: string | null = req.query.searchLoginTerm as any
//         if (!searchLoginTerm) {
//             searchLoginTerm = null
//         }
//
//         let searchEmailTerm: string | null = req.query.searchEmailTerm as any
//         if (!searchEmailTerm) {
//             searchEmailTerm = null
//         }
//
//         let sortBy: string = req.query.sortBy as any
//         if (!sortBy) {
//             sortBy = 'createdAt'
//         }
//
//         let sortDirection: 'asc' | 'desc' | undefined = req.query.sortDirection as 'asc' | 'desc' | undefined
//         if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
//             sortDirection = 'desc'
//         }
//
//         let pageSize: number = req.query.pageSize as any
//         const checkPagSize = +pageSize
//
//         if (!pageSize || !Number.isInteger(checkPagSize) || checkPagSize <= 0) {
//             pageSize = 10
//         }
//
//         let pageNumber: number = req.query.pageNumber as any
//         const checkPageNumber = +pageNumber
//
//         if (!pageNumber || !Number.isInteger(checkPageNumber) || checkPageNumber <= 0) {
//             pageNumber = 1
//         }
//
//         const users = await this.usersService.findUsers(sortBy, sortDirection, +pageSize, +pageNumber,
//             searchLoginTerm, searchEmailTerm)
//         res.status(200).send(users)
//     }
//     async createUser(req: Request, res: Response) {
//
//         const newUser = await this.usersService.createUser(
//             req.body.login,
//             req.body.password,
//             req.body.email)
//         res.status(201).send(newUser)
//     }
//     async deleteUser(req: Request, res: Response) {
//
//         const newUser = await this.usersService.deleteUser(req.params.id)
//
//         if (newUser) {
//             res.sendStatus(204)
//         } else {
//
//             res.sendStatus(404)
//         }
//     }
// }
