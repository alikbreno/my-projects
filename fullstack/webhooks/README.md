# Webhook Inspector

Aplicacao para capturar, armazenar e inspecionar requisicoes de webhook. O projeto possui uma API em Fastify, um painel web em React e PostgreSQL como banco de dados.

## Funcionalidades

- Captura requisicoes de qualquer metodo HTTP em `/capture/*`.
- Armazena metodo, caminho, IP, headers, query params, corpo e metadados da requisicao.
- Lista webhooks com paginacao por cursor.
- Exibe os detalhes de uma requisicao no painel web.
- Permite excluir webhooks capturados.
- Gera um handler TypeScript com Zod a partir de exemplos selecionados, usando o modelo Gemini.
- Disponibiliza documentacao interativa da API em `/docs`.

## Stack

- **API:** Node.js, TypeScript, Fastify, Zod e Drizzle ORM
- **Frontend:** React, Vite, TanStack Router e TanStack Query
- **Banco:** PostgreSQL 17
- **IA:** Google Gemini via AI SDK
- **Gerenciamento:** pnpm workspaces

## Requisitos

- Node.js 20 ou superior
- pnpm 10
- Docker e Docker Compose
- Uma chave da API do Google Generative AI para gerar handlers

## Configuracao

1. Instale as dependencias na raiz do projeto:

   ```bash
   pnpm install
   ```

2. Inicie o PostgreSQL:

   ```bash
   docker compose -f api/docker-compose.yml up -d
   ```

3. Crie o arquivo `api/.env` com as variaveis abaixo:

   ```env
   PORT=3333
   NODE_ENV=development
   DATABASE_URL=postgresql://docker:docker@localhost:5433/webhooks
   GOOGLE_GENERATIVE_AI_API_KEY=sua-chave-do-google
   ```

4. Execute as migrations do banco:

   ```bash
   pnpm --filter api db:migrate
   ```

## Desenvolvimento

Inicie a API em um terminal:

```bash
pnpm --filter api dev
```

Inicie o frontend em outro terminal:

```bash
pnpm --filter web dev
```

O painel estará disponível no endereço exibido pelo Vite, normalmente `http://localhost:5173`. A API estará em `http://localhost:3333`.

Para popular o banco com 70 exemplos de eventos Stripe-like:

```bash
pnpm --filter api db:seed
```

O seed apaga os registros existentes antes de inserir os exemplos.

## API

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/api/webhooks` | Lista webhooks. Aceita `limit` e `cursor`. |
| `GET` | `/api/webhooks/:id` | Retorna os detalhes de um webhook. |
| `DELETE` | `/api/webhooks/:id` | Remove um webhook. |
| `POST` | `/api/generate` | Gera um handler TypeScript a partir de `webhookIds`. |
| Qualquer | `/capture/*` | Captura e persiste uma requisicao recebida. |

### Capturar um webhook

```bash
curl -X POST http://localhost:3333/capture/stripe \
  -H "content-type: application/json" \
  -H "x-example: true" \
  -d '{"type":"payment.succeeded","data":{"id":"pay_123"}}'
```

A resposta contém o UUIDv7 criado:

```json
{
  "id": "019..."
}
```

### Listar webhooks

```bash
curl "http://localhost:3333/api/webhooks?limit=20"
```

Use o campo `nextCursor` retornado pela API para buscar a próxima página:

```bash
curl "http://localhost:3333/api/webhooks?limit=20&cursor=UUID_DO_ULTIMO_ITEM"
```

## Documentacao da API

Com a API em execução, abra [`http://localhost:3333/docs`](http://localhost:3333/docs) para consultar a documentação interativa gerada a partir dos schemas Zod.

## Estrutura

```text
api/
  src/
    db/          Conexao, schema, migrations e seed
    routes/      Endpoints da API
    server.ts    Inicializacao do Fastify
web/
  src/
    components/  Componentes do painel
    routes/      Rotas do TanStack Router
    http/        Schemas e acesso HTTP
```