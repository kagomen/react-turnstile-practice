import { Resend } from 'resend'
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { zValidator } from '@hono/zod-validator'
import { schema } from '../utils/schema'

const app = new Hono()

app.post('/resend', zValidator('json', schema), async (c) => {
  // schemaファイルでバリデーションを行う
  const { name, email, message } = c.req.valid('json')

  const resend = new Resend(c.env.RESEND_API_KEY)

  const res = await resend.emails.send({
    from: `kagome <${c.env.MY_EMAIL_ADDRESS}>`,
    to: c.env.MY_EMAIL_ADDRESS,
    subject: 'お問い合わせが届きました',
    text: `
        名前: ${name}
        メールアドレス: ${email}
        メッセージ: ${message}
      `,
  })

  return c.json(res)
})

export const onRequest = handle(app)
