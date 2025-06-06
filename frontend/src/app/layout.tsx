'use client'; // Indica que este layout é um Client Component (necessário para React Hooks como QueryClientProvider).

import { Inter } from "next/font/google"; // Importa a fonte Inter do Google Fonts.
import "./globals.css"; // Importa estilos globais.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importa QueryClient e QueryClientProvider do React Query.

const inter = Inter({ subsets: ["latin"] }); // Configura a fonte Inter.

// Cria uma instância do QueryClient fora do componente para que não seja recriada a cada renderização.
const queryClient = new QueryClient();

// Layout raiz da aplicação.
export default function RootLayout({
  children, // Conteúdo da página/componentes aninhados.
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> {/* Define o idioma da página. */}
      <body className={inter.className}> {/* Aplica a fonte Inter ao corpo. */}
        {/* Envolve toda a aplicação com o QueryClientProvider para habilitar React Query. */}
        <QueryClientProvider client={queryClient}>
          {children} {/* Renderiza o conteúdo das páginas. */}
        </QueryClientProvider>
      </body>
    </html>
  );
}