// Spec OpenAPI 3.0 escrita à mão (sem swagger-jsdoc), servida via
// swagger-ui-express em /docs. Mantém a documentação num único lugar,
// fácil de comparar com as rotas reais quando alguma mudar.

export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Coworking API',
    version: '1.0.0',
    description:
      'API de gerenciamento de um espaço de coworking: usuários, salas e reservas.',
  },
  servers: [{ url: '/', description: 'Servidor atual' }],
  tags: [
    { name: 'Auth', description: 'Cadastro e login' },
    { name: 'Usuários', description: 'CRUD de usuários' },
    { name: 'Salas', description: 'Catálogo de salas e disponibilidade' },
    { name: 'Reservas', description: 'CRUD de reservas' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Erro: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'object', nullable: true },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          telefone: { type: 'string', nullable: true },
          cpf: { type: 'string', example: '12345678900' },
          eAdmin: { type: 'boolean' },
          dtCriacao: { type: 'string', format: 'date-time' },
          dtAtualizacao: { type: 'string', format: 'date-time' },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'cpf'],
        properties: {
          nome: { type: 'string', example: 'Ana Souza' },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', format: 'password', minLength: 6 },
          telefone: { type: 'string', nullable: true },
          cpf: { type: 'string', example: '12345678900' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', format: 'password' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          usuario: { $ref: '#/components/schemas/Usuario' },
        },
      },
      CreateUsuarioInput: {
        allOf: [
          { $ref: '#/components/schemas/RegisterInput' },
          {
            type: 'object',
            properties: {
              eAdmin: { type: 'boolean', default: false },
            },
          },
        ],
      },
      UpdateUsuarioInput: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', format: 'password', minLength: 6 },
          telefone: { type: 'string', nullable: true },
          cpf: { type: 'string' },
          eAdmin: { type: 'boolean' },
        },
      },
      BusySlot: {
        type: 'object',
        properties: {
          horarioInicio: { type: 'string', example: '14:00' },
          horarioFim: { type: 'string', example: '15:00' },
        },
      },
      Sala: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string' },
          capacidade: { type: 'integer' },
          descricao: { type: 'string', nullable: true },
          precoLocacao: { type: 'number', example: 80 },
          dtCriacao: { type: 'string', format: 'date-time' },
          dtAtualizacao: { type: 'string', format: 'date-time' },
          busySlots: {
            type: 'array',
            items: { $ref: '#/components/schemas/BusySlot' },
            description:
              'Horários já reservados no dia de referência (query "date", padrão hoje) — usado pro relógio de disponibilidade no front.',
          },
        },
      },
      CreateSalaInput: {
        type: 'object',
        required: ['nome', 'capacidade', 'precoLocacao'],
        properties: {
          nome: { type: 'string', example: 'Sala Ipê' },
          capacidade: { type: 'integer', example: 6 },
          descricao: { type: 'string', nullable: true },
          precoLocacao: { type: 'number', example: 80 },
        },
      },
      UpdateSalaInput: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          capacidade: { type: 'integer' },
          descricao: { type: 'string', nullable: true },
          precoLocacao: { type: 'number' },
        },
      },
      Reserva: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          data: { type: 'string', format: 'date', example: '2026-08-10' },
          horarioInicio: { type: 'string', example: '14:00' },
          horarioFim: { type: 'string', example: '15:00' },
          usuarioId: { type: 'string', format: 'uuid' },
          salaId: { type: 'string', format: 'uuid' },
          dtCriacao: { type: 'string', format: 'date-time' },
          dtAtualizacao: { type: 'string', format: 'date-time' },
        },
      },
      CreateReservaInput: {
        type: 'object',
        required: ['salaId', 'data', 'horarioInicio', 'horarioFim'],
        properties: {
          salaId: { type: 'string', format: 'uuid' },
          data: { type: 'string', format: 'date', example: '2026-08-10' },
          horarioInicio: { type: 'string', example: '14:00' },
          horarioFim: { type: 'string', example: '15:00' },
          usuarioId: {
            type: 'string',
            format: 'uuid',
            description: 'Só admin pode reservar em nome de outro usuário.',
          },
        },
      },
      UpdateReservaInput: {
        type: 'object',
        properties: {
          data: { type: 'string', format: 'date' },
          horarioInicio: { type: 'string' },
          horarioFim: { type: 'string' },
        },
      },
    },
    parameters: {
      cursor: {
        name: 'cursor',
        in: 'query',
        schema: { type: 'string', format: 'uuid' },
        description: 'Id do último item da página anterior.',
      },
      limit: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Cria um usuário (não-admin) e retorna o token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '409': { description: 'E-mail ou CPF já cadastrado' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login efetuado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': { description: 'E-mail ou senha inválidos' },
        },
      },
    },
    '/usuarios': {
      get: {
        tags: ['Usuários'],
        summary: 'Lista usuários (admin)',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { $ref: '#/components/parameters/cursor' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          '200': {
            description: 'Lista paginada de usuários',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    usuarios: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Usuario' },
                    },
                    nextCursor: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
          '403': { description: 'Apenas administradores' },
        },
      },
      post: {
        tags: ['Usuários'],
        summary: 'Cria um usuário manualmente (admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUsuarioInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
        },
      },
    },
    '/usuarios/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      get: {
        tags: ['Usuários'],
        summary: 'Busca um usuário (admin ou o próprio)',
        responses: {
          '200': {
            description: 'Usuário encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
          '404': { description: 'Usuário não encontrado' },
        },
      },
      put: {
        tags: ['Usuários'],
        summary: 'Atualiza um usuário (admin ou o próprio)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUsuarioInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuário atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Usuários'],
        summary: 'Remove um usuário (admin ou o próprio)',
        responses: { '204': { description: 'Removido' } },
      },
    },
    '/salas': {
      get: {
        tags: ['Salas'],
        summary: 'Lista salas, com busca e filtro de disponibilidade',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          {
            name: 'date',
            in: 'query',
            schema: { type: 'string', format: 'date' },
            description: 'Dia de referência (padrão: hoje).',
          },
          {
            name: 'time',
            in: 'query',
            schema: { type: 'string', example: '14:00' },
            description:
              'Se enviado junto com "date", só retorna salas livres nesse horário.',
          },
          { $ref: '#/components/parameters/cursor' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          '200': {
            description: 'Lista paginada de salas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    salas: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Sala' },
                    },
                    nextCursor: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Salas'],
        summary: 'Cria uma sala (admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSalaInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Sala criada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sala' },
              },
            },
          },
        },
      },
    },
    '/salas/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      get: {
        tags: ['Salas'],
        summary: 'Busca uma sala',
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': {
            description: 'Sala encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sala' },
              },
            },
          },
          '404': { description: 'Sala não encontrada' },
        },
      },
      put: {
        tags: ['Salas'],
        summary: 'Atualiza uma sala (admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateSalaInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Sala atualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sala' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Salas'],
        summary: 'Remove uma sala (admin)',
        responses: { '204': { description: 'Removida' } },
      },
    },
    '/reservas': {
      get: {
        tags: ['Reservas'],
        summary: 'Lista reservas (próprias, ou todas se admin)',
        parameters: [
          { name: 'salaId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          {
            name: 'usuarioId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Ignorado se quem chama não for admin.',
          },
          { name: 'data', in: 'query', schema: { type: 'string', format: 'date' } },
          { $ref: '#/components/parameters/cursor' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          '200': {
            description: 'Lista paginada de reservas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    reservas: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Reserva' },
                    },
                    nextCursor: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Reservas'],
        summary: 'Cria uma reserva',
        description:
          'Valida: data não passada, mínimo 1h de antecedência, e ausência de conflito de horário na sala.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateReservaInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Reserva criada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reserva' },
              },
            },
          },
          '400': {
            description: 'Data passada, antecedência insuficiente ou intervalo inválido',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
          '409': {
            description: 'Conflito de horário na sala',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
            },
          },
        },
      },
    },
    '/reservas/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      get: {
        tags: ['Reservas'],
        summary: 'Busca uma reserva (dono ou admin)',
        responses: {
          '200': {
            description: 'Reserva encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reserva' },
              },
            },
          },
          '403': { description: 'Sem permissão' },
          '404': { description: 'Reserva não encontrada' },
        },
      },
      put: {
        tags: ['Reservas'],
        summary: 'Atualiza uma reserva (dono ou admin)',
        description: 'Só permitido com no mínimo 1h de antecedência do horário atual.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateReservaInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Reserva atualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reserva' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Reservas'],
        summary: 'Cancela uma reserva (dono ou admin)',
        description: 'Só permitido com no mínimo 1h de antecedência do horário atual.',
        responses: { '204': { description: 'Cancelada' } },
      },
    },
  },
}
