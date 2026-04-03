import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { generateText } from 'ai'
import { z } from 'zod'
import { webhooks } from '@/db/schema'
import { db } from '@/db'
import { inArray } from 'drizzle-orm'
import { google } from '@ai-sdk/google'

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/generate',
    {
      schema: {
        summary: 'Generate a TypeScript handler',
        tags: ['Webhooks'],
        body: z.object({
          webhookIds: z.array(z.string()),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { webhookIds } = request.body

      const result = await db
        .select({ body: webhooks.body })
        .from(webhooks)
        .where(inArray(webhooks.id, webhookIds))

      const webhooksBodies = result.map((webhook) => webhook.body).join('\n\n')

      const { text } = await generateText({
        model: google('gemini-2.5-flash-lite'),
        prompt: `
                You are a senior TypeScript developer.

                I will provide you with examples of webhook request bodies from different events. Based on these examples, your task is to generate a robust and production-ready webhook handler in TypeScript.

                Requirements:
                Use TypeScript.
                Use Zod for schema validation.
                Infer types directly from the Zod schemas.
                Support multiple webhook event types based on the provided examples.
                The output must include:
                A Zod schema for each webhook event.
                A discriminated union (if applicable) to differentiate events.
                A single handler function that:
                Receives the raw request body.
                Validates it against the correct schema.
                Safely parses the data.
                Routes the logic based on the event type.
                The handler should:
                Be type-safe.
                Handle unknown/invalid events gracefully.
                Include clear separation of concerns.
                Use clean and scalable patterns (e.g., mapping event types to handlers).
                Do not use any external libraries besides Zod.
                Assume this will run in a Node.js environment.
                Output format:
                Only output the final TypeScript code.
                Do not include explanations.
                The code must be ready to copy and paste.
                
                """
                ${webhooksBodies}
                """
                
                Input:

                I will provide multiple JSON examples like this:

                {
                    "event": "event_name",
                    "data": { ... }
                }

                Goal:

                Generate a complete TypeScript webhook handler that can correctly validate and process all provided event examples.

                remember: return only the code and do not return within \`\`\`typescript or any other markdown symbols, do not include any introduction or text before or after the code.
            `.trim(),
      })

      return reply.status(201).send({ code: text })
    },
  )
}
