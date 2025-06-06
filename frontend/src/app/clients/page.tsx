'use client';

import { Metadata } from 'next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Importe os componentes ShadCN
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Definição do tipo para o cliente (deve corresponder ao backend)
interface Client {
  id: string;
  name: string;
  email: string;
  status: boolean; // true para ativo, false para inativo
}

// Esquema de validação com Zod para o formulário de cliente
const clientFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Email inválido.').min(1, 'Email é obrigatório.'),
  status: z.boolean(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

// --- NOVO: Defina a URL do backend usando a variável de ambiente ---
// Use process.env.NEXT_PUBLIC_BACKEND_URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// Se o backend não estiver definido, você pode querer adicionar um fallback ou erro
// para depuração em caso de ambiente mal configurado.
if (!BACKEND_URL) {
  console.error("Variável de ambiente NEXT_PUBLIC_BACKEND_URL não definida!");
  // Opcional: throw new Error("Backend URL not configured!");
}


export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: undefined,
      name: '',
      email: '',
      status: true,
    },
  });

  // Busca de clientes com React Query
  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      // --- MUDANÇA AQUI: Use a variável BACKEND_URL ---
      const response = await axios.get<Client[]>(`${BACKEND_URL}/clients`);
      return response.data;
    },
  });

  useEffect(() => {
    if (editingClient) {
      form.reset({
        id: editingClient.id,
        name: editingClient.name,
        email: editingClient.email,
        status: editingClient.status,
      });
    } else {
      form.reset({
        id: undefined,
        name: '',
        email: '',
        status: true,
      });
    }
  }, [editingClient, form]);

  // Função para lidar com a submissão do formulário (criar ou editar)
  const onSubmit = async (values: ClientFormValues) => {
    try {
      if (values.id) {
        // Edição de cliente existente: usa PUT e precisa do ID
        // --- MUDANÇA AQUI: Use a variável BACKEND_URL ---
        await axios.put(`<span class="math-inline">\{BACKEND\_URL\}/clients/</span>{values.id}`, values);
        alert('Cliente atualizado com sucesso!');
      } else {
        // Cadastro de novo cliente: usa POST, ID é gerado pelo backend
        const { id, ...dataToCreate } = values;
        // --- MUDANÇA AQUI: Use a variável BACKEND_URL ---
        await axios.post(`${BACKEND_URL}/clients`, dataToCreate);
        alert('Cliente cadastrado com sucesso!');
      }
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setEditingClient(null);
      form.reset({ id: undefined, name: '', email: '', status: true });
    } catch (err: any) {
      alert('Erro ao salvar cliente: ' + (err.response?.data?.message || err.message));
    }
  };

  // Função para lidar com a exclusão de cliente
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        // --- MUDANÇA AQUI: Use a variável BACKEND_URL ---
        await axios.delete(`<span class="math-inline">\{BACKEND\_URL\}/clients/</span>{id}`);
        alert('Cliente excluído com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        setEditingClient(null);
      } catch (err: any) {
        alert('Erro ao excluir cliente: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (isLoading) return <div className="text-center mt-8">Carregando clientes...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Erro ao carregar clientes: {error.message}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-dark-blue mb-8 text-center">Gerenciar Clientes</h1>

      {/* Formulário de Cadastro/Edição de Clientes */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-dark-blue mb-6">
          {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Status (Ativo)
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="submit" className="bg-dark-blue hover:bg-opacity-90">
                {editingClient ? 'Salvar Edição' : 'Cadastrar Cliente'}
              </Button>
              {editingClient && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingClient(null)}
                >
                  Cancelar Edição
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Listagem de Clientes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-dark-blue mb-6">Lista de Clientes</h2>
        {clients && clients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.status ? 'Ativo' : 'Inativo'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingClient(client)}
                      className="mr-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500">Nenhum cliente cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}