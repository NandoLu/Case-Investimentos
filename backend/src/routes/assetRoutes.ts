// backend/src/routes/assetRoutes.ts
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const assetResponseSchema = z.array(z.object({
  name: z.string(),
  value: z.number(),
}));

const errorResponseSchema = z.object({ // <-- ESTE ESQUEMA DE ERRO É IMPORTANTE
  message: z.string(),
});

const assetRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get('/assets', {
    schema: {
      response: {
        200: assetResponseSchema,
        500: errorResponseSchema, // <-- REGISTRAR O ESQUEMA PARA 500
      },
    },
  }, async (request, reply) => {
    try {
      const fixedAssets = [
        { name: 'Ação PETR4', value: 35.50 },
        { name: 'Fundo XPTO11', value: 105.75 },
        { name: 'CDB Banco Alfa', value: 1000.00 },
        { name: 'Tesouro Selic 2029', value: 12000.00 },
        { name: 'BDR Apple', value: 95.20 },
      ];
      return reply.send(fixedAssets);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar ativos.' });
    }
  });
};

export default assetRoutes;