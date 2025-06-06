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
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod"); // Para validação
// Esquema de validação para criação/edição de cliente (deve ser o mesmo do frontend)
const clientBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Nome é obrigatório.'),
    email: zod_1.z.string().email('Email inválido.').min(1, 'Email é obrigatório.'),
    status: zod_1.z.boolean(),
});
// Esquema para parâmetros de rota (ID)
const clientIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido.').optional(), // ID para PUT/DELETE
});
// Função para registrar as rotas de cliente
// O tipo FastifyInstance com ZodTypeProvider permite usar os schemas Zod diretamente
const clientRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    // Usando ZodTypeProvider se você o tiver configurado, caso contrário, remova.
    // Se não estiver usando fastify-zod, remova `<{ Params: { id: string } }>` e use `request.params.id` diretamente,
    // e remova o `schema` do `get`, `post`, `put`, `delete`.
    const app = fastify.withTypeProvider(); // Se estiver usando fastify-type-provider-zod
    // Rota para listar todos os clientes (GET /clients)
    app.get('/clients', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const clients = yield app.prisma.client.findMany();
            return reply.send(clients);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ message: 'Erro ao buscar clientes.' });
        }
    }));
    // Rota para buscar um cliente por ID (GET /clients/:id)
    app.get('/clients/:id', {
        schema: {
            params: clientIdParamSchema,
        },
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = request.params;
        try {
            const client = yield app.prisma.client.findUnique({
                where: { id },
            });
            if (!client) {
                return reply.status(404).send({ message: 'Cliente não encontrado.' });
            }
            return reply.send(client);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ message: 'Erro ao buscar cliente.' });
        }
    }));
    // Rota para criar um novo cliente (POST /clients)
    app.post('/clients', {
        schema: {
            body: clientBodySchema,
        },
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { name, email, status } = request.body;
        try {
            const newClient = yield app.prisma.client.create({
                data: { name, email, status },
            });
            return reply.status(201).send(newClient); // 201 Created
        }
        catch (error) {
            app.log.error(error);
            if (error.code === 'P2002' && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
                return reply.status(409).send({ message: 'Email já cadastrado.' }); // 409 Conflict
            }
            return reply.status(500).send({ message: 'Erro ao cadastrar cliente.' });
        }
    }));
    // Rota para atualizar um cliente existente (PUT /clients/:id)
    app.put('/clients/:id', {
        schema: {
            params: clientIdParamSchema,
            body: clientBodySchema,
        },
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { id } = request.params;
        const { name, email, status } = request.body;
        try {
            const updatedClient = yield app.prisma.client.update({
                where: { id },
                data: { name, email, status },
            });
            return reply.send(updatedClient);
        }
        catch (error) {
            app.log.error(error);
            if (error.code === 'P2025') { // Prisma error code for record not found for update
                return reply.status(404).send({ message: 'Cliente não encontrado para atualização.' });
            }
            if (error.code === 'P2002' && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
                return reply.status(409).send({ message: 'Email já cadastrado em outro cliente.' });
            }
            return reply.status(500).send({ message: 'Erro ao atualizar cliente.' });
        }
    }));
    // Rota para excluir um cliente (DELETE /clients/:id)
    app.delete('/clients/:id', {
        schema: {
            params: clientIdParamSchema,
        },
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = request.params;
        try {
            yield app.prisma.client.delete({
                where: { id },
            });
            return reply.status(204).send(); // 204 No Content for successful deletion
        }
        catch (error) {
            app.log.error(error);
            if (error.code === 'P2025') { // Prisma error code for record not found for delete
                return reply.status(404).send({ message: 'Cliente não encontrado para exclusão.' });
            }
            return reply.status(500).send({ message: 'Erro ao excluir cliente.' });
        }
    }));
});
exports.default = clientRoutes;
