// frontend/src/app/assets/page.tsx
'use client'; // Indica que este componente deve ser renderizado no lado do cliente.

import { Metadata } from 'next'; // Importa Metadata (comentado, mas útil para SEO).
import { useQuery } from '@tanstack/react-query'; // Hook para gerenciamento de dados assíncronos.
import axios from 'axios'; // Biblioteca para fazer requisições HTTP.
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Componentes de tabela do ShadCN UI.

// Define a estrutura (interface) de um ativo financeiro.
interface Asset {
  name: string;
  value: number;
}

// Metadata para SEO (descomentar para ativar).
// export const metadata: Metadata = {
//   title: 'Ativos Financeiros',
//   description: 'Lista de ativos financeiros disponíveis.',
// };

// Componente principal da página de Ativos.
export default function AssetsPage() {
  // Usa React Query para buscar a lista de ativos do backend.
  const { data: assets, isLoading, error } = useQuery<Asset[]>({
    queryKey: ['assets'], // Chave única para o cache da query.
    queryFn: async () => {
      // Faz a requisição HTTP para a API de ativos.
      // Usa NEXT_PUBLIC_BACKEND_URL do ambiente para apontar ao backend Docker.
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      const response = await axios.get<Asset[]>(`${BACKEND_URL}/assets`);
      return response.data; // Retorna os dados da resposta.
    },
  });

  // Exibe mensagem de carregamento enquanto os dados estão sendo buscados.
  if (isLoading) return <div className="text-center mt-8">Carregando ativos...</div>;
  // Exibe mensagem de erro se a busca falhar.
  if (error) return <div className="text-center mt-8 text-red-500">Erro ao carregar ativos: {error.message}</div>;

  // Renderiza a tabela de ativos.
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-dark-blue mb-8 text-center">Ativos Financeiros</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-dark-blue mb-6">Lista de Ativos</h2>
        {assets && assets.length > 0 ? ( // Verifica se há ativos para exibir.
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Ativo</TableHead>
                <TableHead className="text-right">Valor Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset, index) => (
                <TableRow key={index}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(asset.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          // Mensagem caso não haja ativos.
          <p className="text-center text-gray-500">Nenhum ativo encontrado.</p>
        )}
      </div>
    </div>
  );
}