// frontend/src/app/page.tsx

import Link from "next/link"; // Importa o componente Link para navegação entre páginas.
import { Metadata } from "next"; // Importa Metadata para definir metadados da página (SEO).

// Define os metadados para esta página.
export const metadata: Metadata = {
  title: "Gerenciador de Investimentos - Início",
  description: "Página inicial do sistema de gerenciamento de investimentos.",
};

// Componente da página inicial.
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-8">
      {/* Título principal da página. */}
      <h1 className="text-4xl md:text-5xl font-bold text-dark-blue mb-6 text-center">
        Bem-vindo ao Gerenciador de Investimentos
      </h1>

      {/* Parágrafo de descrição. */}
      <p className="text-lg md:text-xl text-center mb-10 text-gray-600 max-w-2xl">
        Gerencie seus clientes e visualize informações essenciais sobre ativos
        financeiros de forma simples e eficiente.
      </p>

      {/* Navegação para as seções principais do sistema. */}
      <nav className="flex flex-col sm:flex-row gap-4">
        {/* Link para a página de gerenciamento de clientes. */}
        <Link href="/clients" className="bg-dark-blue text-white px-6 py-3 rounded-lg shadow-md hover:bg-opacity-90 transition-colors text-lg text-center">
          Gerenciar Clientes
        </Link>
        {/* Link para a página de visualização de ativos. */}
        <Link href="/assets" className="bg-white text-dark-blue border border-dark-blue px-6 py-3 rounded-lg shadow-md hover:bg-light-gray transition-colors text-lg text-center">
          Ver Ativos
        </Link>
      </nav>
    </div>
  );
}