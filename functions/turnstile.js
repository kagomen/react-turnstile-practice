import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

app.post('/turnstile', async (c) => {
  const { token } = await c.req.json()
  console.log('token', token)
  const secret = c.env.SECRET_KEY
  console.log('secret', secret)

  const res = await fetch(verifyEndpoint, {
    method: 'POST',
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })

  const data = await res.json()

  return c.json(data)
  // if (!data.success) {
  //   return new Response('The provided Turnstile token was not valid! \n' + JSON.stringify(data))
  // }

  // // 検証成功時の処理
  // // The Turnstile token was successfuly validated. Proceed with your application logic.
  // // Validate login, redirect user, etc.
  // // For this demo, we just echo the "/siteverify" response:
  // return new Response('Turnstile token successfuly validated. \n' + JSON.stringify(data))
})

export const onRequest = handle(app)
