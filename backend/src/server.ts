// backend/src/server.ts

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import prismaPlugin from './plugins/prisma';
import clientRoutes from './routes/clientRoutes';
import assetRoutes from './routes/assetRoutes'; // <-- ADICIONE ESTA LINHA para importar as rotas de ativos

const fastify = Fastify({
  logger: true
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(cors, {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(prismaPlugin);

fastify.register(clientRoutes);
fastify.register(assetRoutes); // <-- ADICIONE ESTA LINHA para registrar as rotas de ativos

// Rota de teste (você pode manter ou remover, não interfere)
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Backend listening on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();