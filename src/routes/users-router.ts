// import {Request, Response, Router} from "express";
//
// import {basicAuthGuardMiddleware} from "../validadation/authorization-validatoin";
// import {userAuthCreateValidators, userCreateValidators} from "../validadation/user-validatoin";
// import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
// import {body} from "express-validator";
// import {usersController} from "../composition-root";
//
// export const usersRouter = Router({})
//
//
//
// usersRouter.get('/',basicAuthGuardMiddleware,
//     usersController.getAllUsers.bind(usersController))
//
// usersRouter.post('/',basicAuthGuardMiddleware,userAuthCreateValidators,inputValidationMiddleware,
//     usersController.createUser.bind(usersController))
//
// usersRouter.delete('/:id',basicAuthGuardMiddleware,
//     usersController.deleteUser.bind(usersController))




