// backend/src/routes/clientRoutes.ts

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

// Esquema de validação para o corpo das requisições de cliente (criação/edição).
const clientBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Email inválido.').min(1, 'Email é obrigatório.'),
  status: z.boolean(),
});

// Esquema para validação do ID do cliente nos parâmetros da rota.
const clientIdParamSchema = z.object({
  id: z.string().uuid('ID inválido.').optional(),
});

// Função para registrar as rotas de cliente no Fastify.
const clientRoutes = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Rota: Listar todos os clientes (GET /clients)
  app.get('/clients', async (request, reply) => {
    try {
      const clients = await app.prisma.client.findMany();
      return reply.send(clients);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar clientes.' });
    }
  });

  // Rota: Buscar cliente por ID (GET /clients/:id)
  app.get('/clients/:id', {
    schema: { params: clientIdParamSchema },
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const client = await app.prisma.client.findUnique({ where: { id } });
      if (!client) {
        return reply.status(404).send({ message: 'Cliente não encontrado.' });
      }
      return reply.send(client);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar cliente.' });
    }
  });

  // Rota: Criar novo cliente (POST /clients)
  app.post('/clients', {
    schema: { body: clientBodySchema },
  }, async (request, reply) => {
    const { name, email, status } = request.body;
    try {
      const newClient = await app.prisma.client.create({ data: { name, email, status } });
      return reply.status(201).send(newClient); // 201 Created
    } catch (error: any) {
      app.log.error(error);
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return reply.status(409).send({ message: 'Email já cadastrado.' }); // 409 Conflict
      }
      return reply.status(500).send({ message: 'Erro ao cadastrar cliente.' });
    }
  });

  // Rota: Atualizar cliente existente (PUT /clients/:id)
  app.put('/clients/:id', {
    schema: {
      params: clientIdParamSchema,
      body: clientBodySchema,
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const { name, email, status } = request.body;
    try {
      const updatedClient = await app.prisma.client.update({
        where: { id },
        data: { name, email, status },
      });
      return reply.send(updatedClient);
    } catch (error: any) {
      app.log.error(error);
      if (error.code === 'P2025') { // Cliente não encontrado.
        return reply.status(404).send({ message: 'Cliente não encontrado para atualização.' });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return reply.status(409).send({ message: 'Email já cadastrado em outro cliente.' });
      }
      return reply.status(500).send({ message: 'Erro ao atualizar cliente.' });
    }
  });

  // Rota: Excluir cliente (DELETE /clients/:id)
  app.delete('/clients/:id', {
    schema: { params: clientIdParamSchema },
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      await app.prisma.client.delete({ where: { id } });
      return reply.status(204).send(); // 204 No Content
    } catch (error: any) {
      app.log.error(error);
      if (error.code === 'P2025') { // Cliente não encontrado.
        return reply.status(404).send({ message: 'Cliente não encontrado para exclusão.' });
      }
      return reply.status(500).send({ message: 'Erro ao excluir cliente.' });
    }
  });
};

export default clientRoutes; // Exporta as rotas.