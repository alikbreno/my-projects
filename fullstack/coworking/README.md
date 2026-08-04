# Coworking

Aplicação full stack para gestão de salas de coworking e reservas. Usuários podem consultar a disponibilidade, criar e administrar suas próprias reservas; administradores também têm acesso à gestão de salas, usuários, reservas e indicadores do negócio.

## Principais funcionalidades

- Cadastro, login e sessão com JWT.
- Listagem de salas com busca, filtros de data/horário, disponibilidade visual e paginação infinita.
- Criação, edição e cancelamento de reservas com validações de conflito, data e antecedência mínima de uma hora.
- Área "Minha conta" para editar perfil e excluir a própria conta.
- Área administrativa com dashboard e CRUD de salas e usuários.
- Skeleton loading por rota e por consulta assíncrona, além de estados de erro e feedback de ações.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, React Query, React Hook Form, Zod e Zustand |
| Backend | Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod e JWT |
| Infraestrutura | Docker e Docker Compose |

## Estrutura

```text
.
├── backend/    # API REST, Prisma, regras de negócio e Docker
└── frontend/   # Aplicação Next.js
```

## Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- PostgreSQL 16 ou Docker Desktop

## Como executar localmente

### 1. Inicie o banco e a API

Há duas formas de executar o backend.

#### Com Docker

```bash
cd backend
cp .env.example .env
# Altere JWT_SECRET no arquivo .env
docker compose up --build
```

A API estará disponível em `http://localhost:3333`.

Em um segundo terminal, execute o seed inicial:

```bash
cd backend
docker compose exec api npm run prisma:seed
```

#### Sem Docker

Crie um banco PostgreSQL e configure sua URL de conexão em `backend/.env`.

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run dev
```

### 2. Inicie o frontend

Configure `frontend/.env` com a URL da API:

```env
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

Depois, execute:

```bash
cd frontend
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

> O frontend usa `NEXT_PUBLIC_API_URL`. Caso essa variável não seja definida, a aplicação utiliza `http://localhost:3333` como padrão.

## Usuário administrador de desenvolvimento

O seed cria o seguinte acesso:

```text
E-mail: admin@coworking.com
Senha: admin123
```

Altere essas credenciais antes de qualquer ambiente que não seja local.

## Rotas principais

| Rota | Descrição | Acesso |
| --- | --- | --- |
| `/` | Landing page | Público |
| `/sign-in` | Login | Público |
| `/register` | Cadastro | Público |
| `/salas` | Salas e disponibilidade | Autenticado |
| `/minhas-reservas` | Reservas do usuário; administradores veem todas | Autenticado |
| `/minha-conta` | Perfil do usuário | Autenticado |
| `/administrador` | Dashboard administrativo | Administrador |
| `/administrador/gestao-salas` | Gestão de salas | Administrador |
| `/administrador/gestao-usuarios` | Gestão de usuários | Administrador |

## Regras de negócio relevantes

- Não é permitido criar ou editar reservas em datas passadas.
- Reservas da mesma sala não podem se sobrepor.
- Criar, editar ou cancelar uma reserva exige pelo menos uma hora de antecedência do horário de início.
- Usuários comuns acessam somente as próprias reservas; administradores visualizam e administram todas.
- Apenas administradores podem criar, editar ou excluir salas e gerenciar usuários.

## Scripts

### Frontend

```bash
cd frontend
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # executa o build
npm run lint     # validação de lint
```

### Backend

```bash
cd backend
npm run dev              # desenvolvimento com watch
npm run build            # build TypeScript
npm run start            # executa o build
npm run prisma:generate  # gera o client Prisma
npm run prisma:migrate   # cria/aplica migration local
npm run prisma:deploy    # aplica migrations existentes
npm run prisma:seed      # popula dados iniciais
```

## Documentação da API

Com o backend em execução, a documentação interativa Swagger está disponível em [http://localhost:3333/docs](http://localhost:3333/docs).
