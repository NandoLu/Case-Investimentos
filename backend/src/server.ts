// backend/src/server.ts

import Fastify from 'fastify';
import cors from '@fastify/cors';
// Importe os compiladores do Zod para Fastify
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import prismaPlugin from './plugins/prisma'; // <-- Adicione esta linha
import clientRoutes from './routes/clientRoutes'; // <-- Adicione esta linha

const fastify = Fastify({
  logger: true
});

// Adicione os compiladores do Zod para Fastify
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Registre o plugin fastify-cors
fastify.register(cors, {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// REGISTRE O PLUGIN PRISMA AQUI
fastify.register(prismaPlugin); // <-- Adicione esta linha

// REGISTRE AS ROTAS DE CLIENTES AQUI
fastify.register(clientRoutes); // <-- Adicione esta linha (sem prefixo por enquanto, para combinar com o frontend)
// Se você quiser um prefixo como /api, use: fastify.register(clientRoutes, { prefix: '/api' });
// Mas, se usar, lembre-se de ajustar a URL no frontend para '/api/clients'.

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