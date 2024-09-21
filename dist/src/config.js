"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    jwtSecretKey: process.env.JWT_SECRET_KEY || "minha_chave_secreta",
    serverPort: process.env.PORT || 3000
};
exports.default = config;
