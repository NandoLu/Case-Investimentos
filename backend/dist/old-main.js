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
const cors_1 = __importDefault(require("@fastify/cors")); // <-- Importe o plugin fastify-cors
const fastify = (0, fastify_1.default)({
    logger: true
});
// Registre o plugin fastify-cors
fastify.register(cors_1.default, {
    origin: 'http://localhost:3001', // O frontend Next.js está na porta 3001
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP que seu backend aceita
    // headers: ['Content-Type', 'Authorization'], // Opcional: Se precisar de cabeçalhos customizados
    // credentials: true, // Opcional: Se estiver usando cookies/autenticação com credenciais
});
// Seus endpoints (rotas) virão aqui
fastify.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { hello: 'world' };
}));
// Exemplo de rota de clientes (quando você criar):
// fastify.get('/clients', async (request, reply) => {
//   // ... lógica para buscar clientes
//   return { clients: [] }; // Exemplo
// });
// fastify.post('/clients', async (request, reply) => { /* ... */ });
// fastify.put('/clients/:id', async (request, reply) => { /* ... */ });
// fastify.delete('/clients/:id', async (request, reply) => { /* ... */ });
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // A porta 3000 será exposta pelo Docker
        yield fastify.listen({ port: 3000, host: '0.0.0.0' }); // Use '0.0.0.0' para Fastify dentro do Docker
        console.log('Backend listening on port 3000');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
start();
