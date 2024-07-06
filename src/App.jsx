import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { schema } from '@utils/schema'
import { zodResolver } from '@hookform/resolvers/zod'

function App() {
  const [turnstileToken, setTurnstileToken] = useState()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(data) {
    try {
      const turnstileResponse = await fetch('/turnstile', {
        method: 'POST',
        body: JSON.stringify({ token: turnstileToken }),
        headers: {
          'content-type': 'application/json',
        },
      })

      console.log('turnstileResponse', turnstileResponse)

      if (!turnstileResponse.ok) {
        throw new Error('Turnstile の検証が失敗しました')
      }

      const resendResponse = await fetch('/resend', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
      })

      if (!resendResponse.ok) {
        throw new Error('メールの送信に失敗しました')
      }
      alert('お問い合わせ内容を送信しました！')
      reset() // フォームをリセット
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div>
      <h1>Cloudflare Tunrstile practice</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          名前:
          <input type="text" {...register('name')} />
          <p>{errors.name?.message}</p>
        </label>
        <label>
          メールアドレス:
          <input type="email" {...register('email')} />
          <p>{errors.email?.message}</p>
        </label>
        <label>
          お問い合わせ内容:
          <textarea {...register('message')}></textarea>
          <p>{errors.message?.message}</p>
        </label>
        <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} />
        <button disabled={isSubmitting}>{!isSubmitting ? '送信する' : '送信中...'}</button>
      </form>
      <p className="text">※ 本番環境ではキーの設定をしてないので送信できません</p>
    </div>
  )
}

export default App
