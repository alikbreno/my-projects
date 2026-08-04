# Coworking — Backend

API do sistema de gerenciamento de coworking. Express + TypeScript + Prisma
+ PostgreSQL, com autenticação JWT, CRUD de usuários/salas/reservas,
paginação por cursor e as regras de negócio de disponibilidade.

## Stack

- Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT (`jsonwebtoken`) + `bcryptjs` pro hash de senha
- Zod pra validação de entrada
- Docker + docker-compose

## Rodando com Docker (recomendado)

```bash
cp .env.example .env
# edite o .env e troque o JWT_SECRET

docker compose up --build
```

Isso sobe o Postgres e a API já aplicando as migrations (`prisma migrate
deploy` roda automaticamente no start do container, usando os arquivos que já
vêm em `prisma/migrations/`). A API fica em `http://localhost:3333`.

Rode o seed manualmente na primeira vez (cria um usuário admin e 3 salas de
exemplo):

```bash
docker compose exec api npx prisma db seed
```

## Rodando localmente (sem Docker)

Precisa de um Postgres rodando (pode ser via `docker compose up db`).

```bash
npm install
cp .env.example .env
# ajuste o DATABASE_URL e o JWT_SECRET no .env

npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

Se for alterar o `schema.prisma` (adicionar campo, tabela, etc.), gere uma
nova migration com `npx prisma migrate dev --name nome_da_mudanca`.

## Usuário admin do seed

```
email: admin@coworking.com
senha: admin123
```

Novos usuários se cadastram via `POST /auth/register`, mas **nunca** nascem
admin por essa rota (por segurança) — só o seed cria o primeiro admin, e daí
um admin pode promover outros usando `PUT /usuarios/:id` com `eAdmin: true`.

## Documentação interativa (Swagger)

Com o servidor rodando, acesse **`http://localhost:3333/docs`** — Swagger UI
com todas as rotas, schemas de request/response e o botão "Authorize" pra
colar o `accessToken` e testar as rotas protegidas direto pelo navegador.

## Endpoints

### Auth (público)
| Método | Rota            | Descrição                                |
|--------|-----------------|-------------------------------------------|
| POST   | `/auth/register`| Cria usuário (não-admin) e retorna token |
| POST   | `/auth/login`   | Login, retorna `{ accessToken, usuario }` |

Todas as demais rotas exigem header `Authorization: Bearer <accessToken>`.

### Usuários
| Método | Rota            | Quem pode                     |
|--------|-----------------|--------------------------------|
| GET    | `/usuarios`     | admin                          |
| POST   | `/usuarios`     | admin                          |
| GET    | `/usuarios/:id` | admin ou o próprio usuário     |
| PUT    | `/usuarios/:id` | admin ou o próprio usuário¹    |
| DELETE | `/usuarios/:id` | admin ou o próprio usuário     |

¹ Só um admin consegue alterar o campo `eAdmin` de alguém, mesmo editando o
próprio perfil.

### Salas
| Método | Rota          | Quem pode        |
|--------|---------------|-------------------|
| GET    | `/salas`      | qualquer autenticado |
| GET    | `/salas/:id`  | qualquer autenticado |
| POST   | `/salas`      | admin             |
| PUT    | `/salas/:id`  | admin             |
| DELETE | `/salas/:id`  | admin             |

**Query params de `GET /salas`** (pensados pro front que a gente desenhou):
- `search` — filtra por nome (case-insensitive)
- `date` (`YYYY-MM-DD`) — dia de referência pro relógio de disponibilidade;
  padrão é hoje
- `time` (`HH:mm`) — se enviado junto com `date`, só retorna salas **sem**
  reserva cobrindo aquele horário naquele dia
- `cursor` / `limit` (padrão 10) — paginação por cursor

Resposta:
```json
{
  "salas": [
    {
      "id": "...",
      "nome": "Sala Ipê",
      "capacidade": 6,
      "descricao": "...",
      "precoLocacao": 80,
      "busySlots": [
        { "horarioInicio": "14:00", "horarioFim": "15:00" }
      ]
    }
  ],
  "nextCursor": "uuid-da-ultima-sala-ou-null"
}
```

`busySlots` é exatamente o que o componente `RoomAvailabilityClock` do front
precisa pra desenhar as fatias vermelhas/verdes do relógio.

### Reservas
| Método | Rota             | Quem pode                                |
|--------|------------------|--------------------------------------------|
| GET    | `/reservas`      | usuário comum vê só as próprias; admin vê todas |
| GET    | `/reservas/:id`  | dono da reserva ou admin                  |
| POST   | `/reservas`      | qualquer autenticado                      |
| PUT    | `/reservas/:id`  | dono da reserva ou admin                  |
| DELETE | `/reservas/:id`  | dono da reserva ou admin (cancelamento)   |

Body de `POST /reservas`:
```json
{
  "salaId": "uuid",
  "data": "2026-08-10",
  "horarioInicio": "14:00",
  "horarioFim": "15:00"
}
```

## Regras de negócio implementadas

- **Conflito de agenda**: não é possível reservar uma sala num dia/horário
  que já tem outra reserva sobrepondo (checado em `POST` e `PUT`).
- **Antecedência mínima de 1h**: vale pra criar, editar e cancelar — sempre
  em cima do horário de início da reserva.
- **Data no passado**: bloqueada tanto na criação quanto na edição.
- **Isolamento por usuário**: usuário comum só enxerga/mexe nas próprias
  reservas; um admin pode ver/gerenciar todas e, se quiser, reservar em nome
  de outro usuário passando `usuarioId` no body.

## Integração com o front (contexto da nossa conversa)

- O formato de resposta de `POST /auth/login` e `POST /auth/register` é
  `{ accessToken, usuario }` — bate com o `AuthProps = { accessToken:
  string }` que ajustamos no `useAuth` (zustand + cookie).
- `GET /salas` segue o mesmo formato `{ recurso: [...], nextCursor }` do
  exemplo de paginação infinita que vocês já usam (`useSuspenseInfiniteQuery`
  + `IntersectionObserver`), só que com `salas` no lugar de `webhooks`.
- `search`, `date`, `time`, `cursor` são os query params que o
  `RoomsFilters`/`RoomsList` do prompt anterior devem mandar — e como ficam
  na URL via `useSearchParams`, o filtro sobrevive a um refresh.
- `busySlots` de cada sala alimenta direto o `RoomAvailabilityClock`.
