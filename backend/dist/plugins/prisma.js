"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fastify_plugin_1 = __importDefault(require("fastify-plugin")); // Importe fastify-plugin
const prismaPlugin = (0, fastify_plugin_1.default)((fastify, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    // Conecta ao banco de dados ao iniciar
    yield prisma.$connect();
    // Adiciona o cliente Prisma à instância Fastify
    fastify.decorate('prisma', prisma);
    // Desconecta do banco de dados ao fechar a aplicação
    fastify.addHook('onClose', (fastifyInstance) => __awaiter(void 0, void 0, void 0, function* () {
        yield fastifyInstance.prisma.$disconnect();
    }));
}));
exports.default = prismaPlugin;
