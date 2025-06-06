"use strict";
// backend/src/server.ts
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
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const prisma_1 = __importDefault(require("./plugins/prisma"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const assetRoutes_1 = __importDefault(require("./routes/assetRoutes")); // <-- ADICIONE ESTA LINHA para importar as rotas de ativos
const fastify = (0, fastify_1.default)({
    logger: true
});
fastify.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
fastify.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
fastify.register(cors_1.default, {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});
fastify.register(prisma_1.default);
fastify.register(clientRoutes_1.default);
fastify.register(assetRoutes_1.default); // <-- ADICIONE ESTA LINHA para registrar as rotas de ativos
// Rota de teste (você pode manter ou remover, não interfere)
fastify.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { hello: 'world' };
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Backend listening on port 3000');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
start();
