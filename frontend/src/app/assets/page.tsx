// frontend/src/app/assets/page.tsx
'use client';

import { Metadata } from 'next';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Asset {
  name: string;
  value: number;
}

// export const metadata: Metadata = {
//   title: 'Ativos Financeiros',
//   description: 'Lista de ativos financeiros disponíveis.',
// };

export default function AssetsPage() {
  // Busca de ativos com React Query
  const { data: assets, isLoading, error } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await axios.get<Asset[]>('http://localhost:3000/assets');
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center mt-8">Carregando ativos...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Erro ao carregar ativos: {error.message}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-dark-blue mb-8 text-center">Ativos Financeiros</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-dark-blue mb-6">Lista de Ativos</h2>
        {assets && assets.length > 0 ? (
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
          <p className="text-center text-gray-500">Nenhum ativo encontrado.</p>
        )}
      </div>
    </div>
  );
}