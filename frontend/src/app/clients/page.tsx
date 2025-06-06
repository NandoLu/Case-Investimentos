// frontend/src/app/clients/page.tsx
'use client';

import { Metadata } from 'next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Adicionado useMutation e useQueryClient
import axios from 'axios';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Importe corretamente

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
// NOTA IMPORTANTE: A validação do Zod é para o payload que você envia,
// enquanto o defaultValues do useForm define o estado inicial do formulário.
// Aqui, 'status' será um booleano obrigatório no payload final, mas no formulário,
// se o default for true, ele já será inicializado como booleano.
const clientFormSchema = z.object({
  id: z.string().optional(), // ID é opcional para cadastro, obrigatório para edição
  name: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Email inválido.').min(1, 'Email é obrigatório.'),
  // O status é um booleano e o formulário o tratará como tal.
  // O .default(true) é mais para quando o schema é usado para parsing de dados de entrada,
  // mas aqui para o formulário, o defaultValues do useForm é mais relevante para o estado inicial.
  status: z.boolean(),
});

// A inferência do Zod para os valores do formulário
type ClientFormValues = z.infer<typeof clientFormSchema>;

// Se você precisar de um tipo para os valores padrão do formulário que
// podem incluir campos que são opcionalmente undefined antes de serem preenchidos,
// você pode usar Partial<ClientFormValues> ou definir um tipo específico para defaults.
// No entanto, com o schema acima, ClientFormValues já reflete o que o formulário *deve* ter para ser válido.

// export const metadata: Metadata = {
//   title: 'Gerenciar Clientes',
//   description: 'Página para cadastrar, listar e editar clientes.',
// };

export default function ClientsPage() {
  const queryClient = useQueryClient(); // Para invalidar o cache do React Query
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Configuração do formulário com React Hook Form e Zod
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    // Defina defaultValues com base no tipo ClientFormValues
    defaultValues: {
      id: undefined, // Garante que o ID é undefined inicialmente para novos cadastros
      name: '',
      email: '',
      status: true, // Define o valor padrão para o checkbox
    },
    // No Strict Mode do TypeScript, o zodResolver precisa de uma pequena ajuda
    // para inferir os tipos corretamente em alguns cenários.
    // O erro 'Type 'undefined' is not assignable to type 'boolean'.' pode vir daqui.
    // Uma forma de contornar é garantir que o tipo `ClientFormValues` não tenha campos opcionalmente undefined onde o Zod espera algo concreto.
    // Ou usar `z.boolean().default(true)` para o `status` no schema Zod, que já está lá.
    // O erro pode estar em como o `reset` ou `defaultValues` está sendo aplicado.
  });

  // Busca de clientes com React Query
  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await axios.get<Client[]>('http://localhost:3000/clients');
      return response.data;
    },
  });

  // Efeito para preencher o formulário ao editar um cliente
  useEffect(() => {
    if (editingClient) {
      // Quando preenche para edição, o 'id' é um string.
      // O 'status' do cliente (boolean) deve ser mapeado diretamente para o campo do formulário.
      form.reset({
        id: editingClient.id,
        name: editingClient.name,
        email: editingClient.email,
        status: editingClient.status, // Garanta que é boolean
      });
    } else {
      // Para um novo cadastro, resete para os valores padrão, incluindo ID opcional.
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
        await axios.put(`http://localhost:3000/clients/${values.id}`, values);
        alert('Cliente atualizado com sucesso!');
      } else {
        // Cadastro de novo cliente: usa POST, ID é gerado pelo backend
        // Remove o ID antes de enviar, já que é um novo cadastro e o backend vai gerar um.
        const { id, ...dataToCreate } = values;
        await axios.post('http://localhost:3000/clients', dataToCreate);
        alert('Cliente cadastrado com sucesso!');
      }
      queryClient.invalidateQueries({ queryKey: ['clients'] }); // Invalida o cache para buscar dados atualizados
      setEditingClient(null); // Limpa o formulário de edição
      form.reset({ id: undefined, name: '', email: '', status: true }); // Reseta os campos do formulário para o estado inicial
    } catch (err: any) {
      alert('Erro ao salvar cliente: ' + (err.response?.data?.message || err.message));
    }
  };

  // Função para lidar com a exclusão de cliente
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`http://localhost:3000/clients/${id}`);
        alert('Cliente excluído com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['clients'] }); // Invalida o cache
        setEditingClient(null); // Limpa o formulário se o cliente excluído estiver sendo editado
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