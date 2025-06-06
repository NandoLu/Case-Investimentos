// backend/src/plugins/prisma.ts
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin'; // Importe fastify-plugin

// Estenda a interface FastifyInstance para incluir o cliente Prisma
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastify, opts) => {
  const prisma = new PrismaClient();

  // Conecta ao banco de dados ao iniciar
  await prisma.$connect();

  // Adiciona o cliente Prisma à instância Fastify
  fastify.decorate('prisma', prisma);

  // Desconecta do banco de dados ao fechar a aplicação
  fastify.addHook('onClose', async (fastifyInstance) => {
    await fastifyInstance.prisma.$disconnect();
  });
});

export default prismaPlugin;