// frontend/src/app/layout.tsx

// 'use client' é necessário para usar React Hooks e Context API
// e para o QueryClientProvider, que é um Client Component.
'use client';

import { Inter } from "next/font/google"; // Vamos usar uma fonte mais simples
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Importe do React Query

const inter = Inter({ subsets: ["latin"] }); // Uma fonte padrão e leve

// Não é necessário exportar 'Metadata' aqui se você for usar em 'page.tsx' ou outros layouts
// ou se for uma meta informação mais global do site.
// Geralmente, o metadata é mais eficaz em Route Segments ou páginas individuais.
// Para este caso simples, vamos mantê-lo apenas no page.tsx ou remover se não for essencial.

// Crie uma instância do QueryClient fora do componente para que ela não seja recriada
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}> {/* Usando a fonte Inter */}
        {/* Envolva todo o 'children' com o QueryClientProvider */}
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}