// backend/src/server.ts

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import prismaPlugin from './plugins/prisma';
import clientRoutes from './routes/clientRoutes';
import assetRoutes from './routes/assetRoutes'; // Importa as rotas de ativos.

// Inicializa o servidor Fastify com logger.
const fastify = Fastify({
  logger: true
});

// Configura os compiladores do Zod para validação e serialização de schemas.
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Registra o plugin Fastify CORS para permitir requisições do frontend.
fastify.register(cors, {
  origin: 'http://localhost:3001', // Permite requisições do frontend.
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos.
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos.
});

// Registra o plugin Prisma para conexão com o banco de dados.
fastify.register(prismaPlugin);

// Registra as rotas de clientes.
fastify.register(clientRoutes);
// Registra as rotas de ativos.
fastify.register(assetRoutes);

// Rota de teste simples.
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// Função para iniciar o servidor.
const start = async () => {
  try {
    // Inicia o servidor Fastify na porta 3000.
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Backend listening on port 3000');
  } catch (err) {
    // Loga erros e encerra o processo em caso de falha ao iniciar.
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); // Chama a função para iniciar o servidor.