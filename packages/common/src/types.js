"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomSchema = exports.SignInSchema = exports.CreateUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CreateUserSchema = zod_1.default.object({
    username: zod_1.default.string().min(3).max(20),
    password: zod_1.default.string(),
    name: zod_1.default.string()
});
exports.SignInSchema = zod_1.default.object({
    username: zod_1.default.string().min(3).max(20),
    password: zod_1.default.string()
});
exports.CreateRoomSchema = zod_1.default.object({
    name: zod_1.default.string().min(3).max(20),
});
__exportStar(require("./types"), exports);
