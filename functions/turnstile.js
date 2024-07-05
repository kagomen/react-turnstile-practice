import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

app.post('/turnstile', async (c) => {
  const { token } = await c.req.json()

  const formData = new FormData()
  formData.append('secret', c.env.TURNSTILE_SECRET_KEY)
  formData.append('response', token)

  // fetchリクエスト送信時にFormDataオブジェクトを使っているため、
  // content-typeヘッダーは自動的に適切な値（multipart/form-data）に設定される
  // なので手動でcontent-typeを指定する必要はない

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

  const result = await fetch(url, {
    body: formData,
    method: 'POST',
  })

  const data = await result.json()
  return c.json(data)

  // const { token } = await c.req.json()
  // const secret = c.env.TURNSTILE_SECRET_KEY

  // const res = await fetch(url, {
  //   method: 'POST',
  //   body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
  //   headers: {
  //     'content-type': 'application/x-www-form-urlencoded',
  //   },
  // })

  // const data = await res.json()

  // return c.json(data)
})

export const onRequest = handle(app)
