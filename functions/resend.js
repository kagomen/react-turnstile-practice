import { Resend } from 'resend'
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

app.post('/resend', async (c) => {
  const resend = new Resend(c.env.RESEND_API_KEY)

  const { name, email, message } = await c.req.json()
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
