"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../service/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber) {
        if (!searchLoginTerm) {
            searchLoginTerm = null;
        }
        if (!searchEmailTerm) {
            searchEmailTerm = null;
        }
        if (!sortBy) {
            sortBy = 'createdAt';
        }
        if (!sortDirection || sortDirection.toLowerCase() !== 'asc') {
            sortDirection = 'desc';
        }
        const checkPageSize = +pageSize;
        if (!pageSize || !Number.isInteger(checkPageSize) || checkPageSize <= 0) {
            pageSize = 10;
        }
        const checkPageNumber = +pageNumber;
        if (!pageNumber ||
            !Number.isInteger(checkPageNumber) ||
            checkPageNumber <= 0) {
            pageNumber = 1;
        }
        return await this.userService.getAllUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber);
    }
    async postUser(login, password, email) {
        return await this.userService.postUser(login, password, email);
    }
    async deleteUser(id, res) {
        const userDeleted = await this.userService.deleteUser(id);
        if (!userDeleted) {
            res.sendStatus(404);
            return false;
        }
        else {
            res.sendStatus(204);
            return true;
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('searchLoginTerm')),
    __param(1, (0, common_1.Query)('searchEmailTerm')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortDirection')),
    __param(4, (0, common_1.Query)('pageSize')),
    __param(5, (0, common_1.Query)('pageNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('login')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "postUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map