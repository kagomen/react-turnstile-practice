import { Turnstile } from '@marsidev/react-turnstile'
import { useRef } from 'react'

function App() {
  const formRef = new useRef()

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    const token = formData.get('cf-turnstile-response')

    // console.log('token', token)
    // console.log('formData', formData)

    // POSTメソッドでトークンをJSON形式でバックエンドに送信
    const res = await fetch('/turnstile', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'content-type': 'application/json',
      },
    })

    console.log('res', res)

    const data = await res.json()

    console.log('data', data)
    if (data.success) {
      // 検証成功時の処理
      console.log('Success!')
    }
  }

  return (
    <div>
      <p>Tunrstile practice</p>
      <form ref={formRef} onSubmit={handleSubmit}>
        {/* <input type="text" /> */}
        <Turnstile siteKey={import.meta.env.VITE_SITE_KEY} />
        <button>submit</button>
      </form>
    </div>
  )
}

export default App
