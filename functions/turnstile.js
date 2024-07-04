import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

app.get('/turnstile', (c) => {
  return c.text('turnstile test!')
})

export const onRequest = handle(app)