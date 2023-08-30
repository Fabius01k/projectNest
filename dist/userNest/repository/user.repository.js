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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../schema/user.schema");
const mongoose_2 = require("mongoose");
const mapUserToDto = (user) => {
    return {
        id: user.id,
        login: user.accountData.userName.login,
        email: user.accountData.userName.email,
        createdAt: user.accountData.createdAt,
    };
};
let UserRepository = class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findAllUsersInDb(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber) {
        const filter = {
            $or: [
                {
                    'accountData.userName.login': {
                        $regex: searchLoginTerm ?? '',
                        $options: 'i',
                    },
                },
                {
                    'accountData.userName.email': {
                        $regex: searchEmailTerm ?? '',
                        $options: 'i',
                    },
                },
            ],
        };
        const users = await this.userModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();
        const items = users.map((u) => mapUserToDto(u));
        const totalCount = await this.userModel.countDocuments(filter);
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: items,
        };
    }
    async createUserInDb(newUser) {
        const createdUser = new this.userModel(newUser);
        await createdUser.save();
        return mapUserToDto(newUser);
    }
    async deleteUserInDb(id) {
        const deletedUser = await this.userModel.deleteOne({ id: id });
        return deletedUser.deletedCount === 1;
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserRepository);
//# sourceMappingURL=user.repository.js.map