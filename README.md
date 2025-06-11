# caseInvestimentos

**Sistema de Gerenciamento de Investimentos**  
Este projeto é uma aplicação full-stack containerizada com Docker Compose, desenvolvida para gerenciar clientes e visualizar informações básicas de ativos financeiros.

---

## 🧰 Stack Tecnológica

- **Backend:** Node.js (Fastify, Prisma ORM, Zod)
- **Frontend:** Next.js (ShadCN UI, React Query, Axios)
- **Banco de Dados:** MySQL 8.0
- **Containerização:** Docker e Docker Compose
- **Linguagem:** TypeScript (100%)

---

## ⚙️ Funcionalidades

### Backend
- **CRUD de Clientes:** Cadastrar, listar e editar clientes com nome, e-mail e status (ativo/inativo).
- **Listagem de Ativos:** Endpoint que retorna uma lista fixa e estática de ativos financeiros (ex: `Ação PETR4`, `Fundo XPTO11`).

### Frontend
- **Página de Clientes:** Interface para listar, adicionar e editar informações de clientes.
- **Página de Ativos:** Exibe a lista fixa de ativos financeiros (somente leitura).

---

## ✅ Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter as seguintes ferramentas instaladas:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js (v20 ou superior)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

---

## 🚀 Como Rodar a Aplicação

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd caseInvestimentos
```

### 2. Subir os Serviços Docker (Backend e Banco de Dados)

```bash
docker-compose down
docker-compose up -d --build
```

Verifique se os serviços estão saudáveis com:

```bash
docker-compose ps
```

### 3. Rodar as Migrações do Prisma

```bash
docker-compose exec backend npx prisma migrate dev --name initial_migration
```

> Isso criará a tabela `Client` no banco de dados MySQL, conforme definido em `backend/prisma/schema.prisma`.

### 4. Instalar Dependências e Iniciar o Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Acessar a Aplicação

- **Frontend:** [http://localhost:3001](http://localhost:3001)
- **Backend (API):** [http://localhost:3000](http://localhost:3000)

> O frontend se comunica com o backend via `http://backend:3000` dentro da rede Docker.

---

## 🗂️ Estrutura do Projeto

```
caseInvestimentos/
├── backend/
│   ├── prisma/              # Schema e migrações Prisma
│   ├── src/                 # Código TypeScript do backend
│   └── dist/                # Código compilado para produção
├── frontend/
│   └── src/                 # Código TypeScript do frontend (Next.js)
├── docker-compose.yml       # Orquestração dos containers
```

---

## 📦 Entregáveis

- Repositórios organizados para frontend e backend
- Script de migração inicial:  
  `backend/prisma/migrations/20250604125840_create_client_table/migration.sql`

---

## 👤 Autor

**Luiz Fernando Balbino**
