// backend/src/routes/clientRoutes.ts
import { FastifyInstance } from 'fastify';
import { z } from 'zod'; // Para validação
import { ZodTypeProvider } from 'fastify-type-provider-zod'; // Se estiver usando fastify-zod

// Esquema de validação para criação/edição de cliente (deve ser o mesmo do frontend)
const clientBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Email inválido.').min(1, 'Email é obrigatório.'),
  status: z.boolean(),
});

// Esquema para parâmetros de rota (ID)
const clientIdParamSchema = z.object({
  id: z.string().uuid('ID inválido.').optional(), // ID para PUT/DELETE
});

// Função para registrar as rotas de cliente
// O tipo FastifyInstance com ZodTypeProvider permite usar os schemas Zod diretamente
const clientRoutes = async (fastify: FastifyInstance) => {
  // Usando ZodTypeProvider se você o tiver configurado, caso contrário, remova.
  // Se não estiver usando fastify-zod, remova `<{ Params: { id: string } }>` e use `request.params.id` diretamente,
  // e remova o `schema` do `get`, `post`, `put`, `delete`.
  const app = fastify.withTypeProvider<ZodTypeProvider>(); // Se estiver usando fastify-type-provider-zod

  // Rota para listar todos os clientes (GET /clients)
  app.get('/clients', async (request, reply) => {
    try {
      const clients = await app.prisma.client.findMany();
      return reply.send(clients);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar clientes.' });
    }
  });

  // Rota para buscar um cliente por ID (GET /clients/:id)
  app.get('/clients/:id', {
    schema: {
      params: clientIdParamSchema,
    },
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const client = await app.prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        return reply.status(404).send({ message: 'Cliente não encontrado.' });
      }
      return reply.send(client);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar cliente.' });
    }
  });

  // Rota para criar um novo cliente (POST /clients)
  app.post('/clients', {
    schema: {
      body: clientBodySchema,
    },
  }, async (request, reply) => {
    const { name, email, status } = request.body;
    try {
      const newClient = await app.prisma.client.create({
        data: { name, email, status },
      });
      return reply.status(201).send(newClient); // 201 Created
    } catch (error: any) {
      app.log.error(error);
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return reply.status(409).send({ message: 'Email já cadastrado.' }); // 409 Conflict
      }
      return reply.status(500).send({ message: 'Erro ao cadastrar cliente.' });
    }
  });

  // Rota para atualizar um cliente existente (PUT /clients/:id)
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
      if (error.code === 'P2025') { // Prisma error code for record not found for update
        return reply.status(404).send({ message: 'Cliente não encontrado para atualização.' });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return reply.status(409).send({ message: 'Email já cadastrado em outro cliente.' });
      }
      return reply.status(500).send({ message: 'Erro ao atualizar cliente.' });
    }
  });

  // Rota para excluir um cliente (DELETE /clients/:id)
  app.delete('/clients/:id', {
    schema: {
      params: clientIdParamSchema,
    },
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      await app.prisma.client.delete({
        where: { id },
      });
      return reply.status(204).send(); // 204 No Content for successful deletion
    } catch (error: any) {
      app.log.error(error);
      if (error.code === 'P2025') { // Prisma error code for record not found for delete
        return reply.status(404).send({ message: 'Cliente não encontrado para exclusão.' });
      }
      return reply.status(500).send({ message: 'Erro ao excluir cliente.' });
    }
  });
};

export default clientRoutes;