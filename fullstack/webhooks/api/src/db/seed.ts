import { db } from '.'
import { webhooks } from './schema'
import { faker } from '@faker-js/faker'

const stripeEvents = [
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'charge.refunded',
  'charge.dispute.created',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.finalized',
  'invoice.payment_action_required',
  'payment_method.attached',
  'payment_method.detached',
  'coupon.created',
  'coupon.deleted',
]

function randomStripePayload(eventType: string) {
  const amount = faker.number.int({ min: 500, max: 50000 })
  const currency = faker.helpers.arrayElement(['usd', 'eur', 'brl'])
  return {
    id: `evt_${faker.string.alphanumeric(24)}`,
    object: 'event',
    api_version: '2024-11-01',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: `pi_${faker.string.alphanumeric(24)}`,
        object: 'payment_intent',
        amount,
        currency,
        status: eventType.includes('failed')
          ? 'requires_payment_method'
          : 'succeeded',
        customer: `cus_${faker.string.alphanumeric(16)}`,
        invoice: `in_${faker.string.alphanumeric(16)}`,
      },
      previous_attributes: eventType.includes('updated')
        ? { status: 'past_due' }
        : undefined,
    },
    livemode: false,
    pending_webhooks: faker.number.int({ min: 0, max: 1 }),
    request: {
      id: `req_${faker.string.alphanumeric(24)}`,
      idempotency_key: null,
    },
    type: eventType,
  }
}

async function seed() {
  const records = Array.from({ length: 70 }, () => {
    const eventType = faker.helpers.arrayElement(stripeEvents)
    const payload = randomStripePayload(eventType)
    const body = JSON.stringify(payload, null, 2)

    return {
      method: 'POST',
      pathname: '/api/webhooks/stripe',
      ip: faker.internet.ipv4(),
      statusCode: faker.helpers.arrayElement([200, 400, 401, 422, 500]),
      contentType: 'application/json',
      contentLength: Buffer.byteLength(body, 'utf8'),
      queryParams: {
        source: 'stripe',
        event: eventType,
      },
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'stripe-signature': `t=${Date.now()}, v1=${faker.string.hexadecimal({ length: 128, casing: 'lower' }).slice(2)}`,
        'user-agent': `Stripe/2024-11-01 (+https://stripe.com/docs/webhooks)`,
      },
      body,
      createAt: faker.date.past({ years: 1 }),
    }
  })

  await db.delete(webhooks).execute()
  await db.insert(webhooks).values(records)

  console.log(
    `Seed aplicado: ${records.length} registros webhooks (Stripe-like) inseridos.`,
  )
}

seed().catch((error) => {
  console.error('Erro no seed:', error)
  process.exit(1)
})
