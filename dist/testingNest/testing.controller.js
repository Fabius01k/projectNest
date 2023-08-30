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
exports.TestingController = void 0;
const common_1 = require("@nestjs/common");
const testing_service_1 = require("./testing.service");
let TestingController = class TestingController {
    constructor(myService) {
        this.myService = myService;
    }
    async deleteAllData() {
        await this.myService.deleteAllData();
        return 'Data deleted successfully';
    }
};
exports.TestingController = TestingController;
__decorate([
    (0, common_1.Delete)('all-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestingController.prototype, "deleteAllData", null);
exports.TestingController = TestingController = __decorate([
    (0, common_1.Controller)('testing'),
    __metadata("design:paramtypes", [testing_service_1.TestingService])
], TestingController);
//# sourceMappingURL=testing.controller.js.map