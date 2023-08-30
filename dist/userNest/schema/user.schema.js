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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongodb_1 = require("mongodb");
let User = class User {
    constructor(_id, id, accountData, emailConfirmation, passwordUpdate) {
        this._id = _id;
        this.id = id;
        this.accountData = accountData;
        this.emailConfirmation = emailConfirmation;
        this.passwordUpdate = passwordUpdate;
    }
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ type: mongodb_1.ObjectId, required: true }),
    __metadata("design:type", mongodb_1.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        resetPasswordCode: { type: String, default: null },
        expirationDatePasswordCode: { type: Date, default: null },
    })),
    __metadata("design:type", Object)
], User.prototype, "passwordUpdate", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        userName: (0, mongoose_1.raw)({
            login: { type: String, required: true },
            email: { type: String, required: true },
        }),
        passwordHash: { type: String, required: true },
        passwordSalt: { type: String, required: true },
        createdAt: { type: String, required: true },
    })),
    __metadata("design:type", Object)
], User.prototype, "accountData", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true },
    })),
    __metadata("design:type", Object)
], User.prototype, "emailConfirmation", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)(),
    __metadata("design:paramtypes", [mongodb_1.ObjectId, String, Object, Object, Object])
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map