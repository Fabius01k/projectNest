// import {Request, Response, Router} from "express";
// import {tokenUserValidator} from "../validadation/authorization-validatoin";
//
//
// import {deleteSessionByIdVavidation} from "../validadation/security-validation";
// import {securityController} from "../composition-root";
//
// export const securityRouter = Router({})
//
// securityRouter.get('/devices', tokenUserValidator,
//     securityController.getAllActiveUsersSession.bind(securityController))
//
// securityRouter.delete('/devices', tokenUserValidator,
//     securityController.deleteAllOthersSessions.bind(securityController))
//
// securityRouter.delete('/devices/:deviceId',tokenUserValidator, deleteSessionByIdVavidation,
//     securityController.deleteSessionById.bind(securityController))
