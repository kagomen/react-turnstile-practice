import * as yup from 'yup'

export const schema = yup.object({
  name: yup.string().trim().min(1, '名前を入力してください').max(60, '最大${max}文字までです'),
  email: yup
    .string()
    .trim()
    .min(1, 'メールアドレスを入力してください')
    .email('メールアドレスの形式で入力してください')
    .max(254, '最大${max}文字までです'),
  message: yup.string().min(1, 'メッセージを入力してください').max(1000, '最大${max}文字までです'),
})
