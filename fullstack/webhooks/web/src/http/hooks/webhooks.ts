import { apiFetch } from '../client'
import {
  generateHandlerSchema,
  webhookDetailSchema,
  webhookListSchema,
} from '../schemas/webhooks'

export async function getWebhooks(cursor?: string) {
  const searchParams = new URLSearchParams()

  if (cursor) {
    searchParams.set('cursor', cursor)
  }

  const query = searchParams.toString()
  const response = await apiFetch(`/api/webhooks${query ? `?${query}` : ''}`)
  const data: unknown = await response.json()

  return webhookListSchema.parse(data)
}

export async function getWebhook(id: string) {
  const response = await apiFetch(`/api/webhooks/${id}`)
  const data: unknown = await response.json()

  return webhookDetailSchema.parse(data)
}

export async function deleteWebhook(id: string) {
  await apiFetch(`/api/webhooks/${id}`, {
    method: 'DELETE',
  })
}

export async function generateHandler(webhookIds: string[]) {
  const response = await apiFetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ webhookIds }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data: unknown = await response.json()

  return generateHandlerSchema.parse(data)
}
