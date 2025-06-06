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
const zod_1 = require("zod");
const assetResponseSchema = zod_1.z.array(zod_1.z.object({
    name: zod_1.z.string(),
    value: zod_1.z.number(),
}));
const errorResponseSchema = zod_1.z.object({
    message: zod_1.z.string(),
});
const assetRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    const app = fastify.withTypeProvider();
    app.get('/assets', {
        schema: {
            response: {
                200: assetResponseSchema,
                500: errorResponseSchema, // <-- REGISTRAR O ESQUEMA PARA 500
            },
        },
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fixedAssets = [
                { name: 'Ação PETR4', value: 35.50 },
                { name: 'Fundo XPTO11', value: 105.75 },
                { name: 'CDB Banco Alfa', value: 1000.00 },
                { name: 'Tesouro Selic 2029', value: 12000.00 },
                { name: 'BDR Apple', value: 95.20 },
            ];
            return reply.send(fixedAssets);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ message: 'Erro ao buscar ativos.' });
        }
    }));
});
exports.default = assetRoutes;
