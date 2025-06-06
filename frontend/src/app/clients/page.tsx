'use client'; // Indica que este é um Client Component no Next.js.

import { Metadata } from 'next'; // Para SEO (comentado).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Hooks para gerenciamento de dados.
import axios from 'axios'; // Para requisições HTTP.
import { useEffect, useState } from 'react'; // Hooks React.
import { z } from 'zod'; // Para validação de schemas.
import { useForm } from 'react-hook-form'; // Para gerenciamento de formulários.
import { zodResolver } from '@hookform/resolvers/zod'; // Integra Zod com React Hook Form.

// Importa componentes UI do ShadCN.
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

// Definição do tipo para o objeto Cliente.
interface Client {
  id: string;
  name: string;
  email: string;
  status: boolean; // true = ativo, false = inativo
}

// Esquema de validação para o formulário de cliente usando Zod.
const clientFormSchema = z.object({
  id: z.string().optional(), // ID é opcional para novos clientes.
  name: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Email inválido.').min(1, 'Email é obrigatório.'),
  status: z.boolean(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>; // Tipo inferido do schema Zod.

// Define a URL do backend a partir de variável de ambiente.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Alerta se a URL do backend não estiver configurada (para depuração).
if (!BACKEND_URL) {
  console.error("Variável de ambiente NEXT_PUBLIC_BACKEND_URL não definida!");
}

// Componente principal da página de Clientes.
export default function ClientsPage() {
  const queryClient = useQueryClient(); // Cliente do React Query para invalidar o cache.
  const [editingClient, setEditingClient] = useState<Client | null>(null); // Estado para cliente em edição.

  // Configura o formulário com React Hook Form e Zod.
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      id: undefined,
      name: '',
      email: '',
      status: true,
    },
  });

  // Busca a lista de clientes usando React Query.
  const { data: clients, isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'], // Chave para o cache da query.
    queryFn: async () => {
      const response = await axios.get<Client[]>(`${BACKEND_URL}/clients`);
      return response.data;
    },
  });

  // Efeito para preencher o formulário quando um cliente é selecionado para edição.
  useEffect(() => {
    if (editingClient) {
      form.reset(editingClient); // Preenche o formulário com dados do cliente.
    } else {
      form.reset({ id: undefined, name: '', email: '', status: true }); // Limpa o formulário.
    }
  }, [editingClient, form]);

  // Função para lidar com a submissão do formulário (criação ou edição).
  const onSubmit = async (values: ClientFormValues) => {
    try {
      if (values.id) {
        // Edita cliente existente.
        await axios.put(`${BACKEND_URL}/clients/${values.id}`, values);
        alert('Cliente atualizado com sucesso!');
      } else {
        // Cria novo cliente.
        const { id, ...dataToCreate } = values; // Remove o ID para criação.
        await axios.post(`${BACKEND_URL}/clients`, dataToCreate);
        alert('Cliente cadastrado com sucesso!');
      }
      queryClient.invalidateQueries({ queryKey: ['clients'] }); // Invalida cache para re-fetch.
      setEditingClient(null); // Sai do modo de edição.
      form.reset(); // Limpa o formulário.
    } catch (err: any) {
      alert('Erro ao salvar cliente: ' + (err.response?.data?.message || err.message));
    }
  };

  // Função para lidar com a exclusão de cliente.
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`${BACKEND_URL}/clients/${id}`);
        alert('Cliente excluído com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['clients'] }); // Invalida cache para re-fetch.
        setEditingClient(null); // Sai do modo de edição, se aplicável.
      } catch (err: any) {
        alert('Erro ao excluir cliente: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Exibe mensagem de carregamento.
  if (isLoading) return <div className="text-center mt-8">Carregando clientes...</div>;
  // Exibe mensagem de erro.
  if (error) return <div className="text-center mt-8 text-red-500">Erro ao carregar clientes: {error.message}</div>;

  // Renderiza a interface do usuário.
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-dark-blue mb-8 text-center">Gerenciar Clientes</h1>

      {/* Formulário de Cadastro/Edição */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-dark-blue mb-6">
          {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl><Input placeholder="Nome do cliente" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="email@exemplo.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo Status (Checkbox) */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none"><FormLabel>Status (Ativo)</FormLabel></div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Botões de Ação do Formulário */}
            <div className="flex gap-4">
              <Button type="submit" className="bg-dark-blue hover:bg-opacity-90">
                {editingClient ? 'Salvar Edição' : 'Cadastrar Cliente'}
              </Button>
              {editingClient && (
                <Button type="button" variant="outline" onClick={() => setEditingClient(null)}>
                  Cancelar Edição
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Seção de Listagem de Clientes */}
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