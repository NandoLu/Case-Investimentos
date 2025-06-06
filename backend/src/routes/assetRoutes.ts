import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

// Esquema de validação para a resposta de ativos (array de objetos com nome e valor).
const assetResponseSchema = z.array(z.object({
  name: z.string(),
  value: z.number(),
}));

// Esquema de validação para mensagens de erro.
const errorResponseSchema = z.object({
  message: z.string(),
});

// Define as rotas para ativos financeiros.
const assetRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Rota: Listar ativos financeiros (GET /assets)
  app.get('/assets', {
    schema: {
      response: {
        200: assetResponseSchema, // Resposta esperada para sucesso (200 OK).
        500: errorResponseSchema, // Resposta esperada para erro interno (500 Internal Server Error).
      },
    },
  }, async (request, reply) => {
    try {
      // Dados fixos (mockados) de ativos.
      const fixedAssets = [
        { name: 'Ação PETR4', value: 35.50 },
        { name: 'Fundo XPTO11', value: 105.75 },
        { name: 'CDB Banco Alfa', value: 1000.00 },
        { name: 'Tesouro Selic 2029', value: 12000.00 },
        { name: 'BDR Apple', value: 95.20 },
      ];
      return reply.send(fixedAssets); // Retorna os ativos fixos.
    } catch (error) {
      app.log.error(error); // Loga qualquer erro inesperado.
      return reply.status(500).send({ message: 'Erro ao buscar ativos.' }); // Retorna erro 500.
    }
  });
};

export default assetRoutes; // Exporta as rotas de ativos.