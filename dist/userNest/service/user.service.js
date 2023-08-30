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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("../schema/user.schema");
const user_repository_1 = require("../repository/user.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const mongodb_1 = require("mongodb");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async _generateHash(password, salt) {
        const hash = await bcrypt_1.default.hash(password, salt);
        return hash;
    }
    async getAllUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber) {
        return await this.userRepository.findAllUsersInDb(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber);
    }
    async postUser(login, password, email) {
        const passwordSalt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt);
        const dateNow = new Date().getTime().toString();
        const newUser = new user_schema_1.User(new mongodb_1.ObjectId(), dateNow, {
            userName: {
                login: login,
                email: email,
            },
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString(),
        }, {
            confirmationCode: (0, uuid_1.v4)(),
            expirationDate: (0, add_1.default)(new Date(), {
                hours: 1,
            }),
            isConfirmed: true,
        }, {
            resetPasswordCode: null,
            expirationDatePasswordCode: new Date(),
        });
        return await this.userRepository.createUserInDb(newUser);
    }
    async deleteUser(id) {
        const userDeleted = await this.userRepository.deleteUserInDb(id);
        if (!userDeleted) {
            return false;
        }
        return true;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map