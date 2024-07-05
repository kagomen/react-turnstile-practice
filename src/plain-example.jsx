import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const token = formData.get('cf-turnstile-response')

    // POSTメソッドでトークンをJSON形式でバックエンドに送信
    const res = await fetch('/turnstile', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const data = await res.json()

    // Turnstile検証成功時の処理
    if (data.success) {
      // Resendにデータを送信
      const resendRes = await fetch('/resend', {
        method: 'POST',
        body: JSON.stringify({ name: 'kagome' }),
        headers: {
          'content-type': 'application/json',
        },
      })

      const resendData = await resendRes.json()
      console.log(resendData)

      console.log('data', data)
      console.log('Success!')
      setIsLoading(false)
    }

    // 失敗時の処理
  }

  return (
    <div>
      <h1>Tunrstile practice</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={() => setIsLoading(false)} />
        <button disabled={isLoading}>{isLoading ? 'ローディング中...' : '送信する'}</button>
      </form>
    </div>
  )
}

export default App
