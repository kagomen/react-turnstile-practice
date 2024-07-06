## 参考

- https://developers.cloudflare.com/turnstile/
- https://blog.cloudflare.com/guide-to-cloudflare-pages-and-turnstile-plugin
- https://docs.page/marsidev/react-turnstile
- https://zenn.dev/naporin24690/articles/11d4ee3ecb3257

# Memo

## Hono

- c.json(hoge) / Hono

  - Content-Type が application/json の new Response を作成する
  - レスポンスを JSON 形式で返すためのメソッド
  - https://hono.dev/docs/api/context#json

- Response.json() / JavaScript

  - JSON 形式のレスポンスを JavaScript オブジェクトに変換する

- JSON.stringify(hoge) / JavaScript
  - hoge を JSON 形式に変換する

## content-type の比較

- multipart/form-data
  - ソースコードが読みやすい（特に多くのキーを送信する場合に有効）が、パフォーマンスに劣る
- application/x-www-form-urlencoded
  - コードは冗長だが、パフォーマンスに優れる

## JavaScript

- エラーハンドリング

```js
try {
  // 成功時の処理
} catch (err) {
  return err.message
}
// errorがあっても実行されるが
// catch内でreturnがあると実行されない
```

```js
try {
  // 成功時の処理
} catch (err) {
  return err.message
} finally {
  // errorがあっても実行される
  // returnがあっても実行される
}
```

- https://www.youtube.com/watch?v=faCCTvt1_Ic

## React-Turnstile

- Turnstile ウィジェットに`onSuccess={setToken}`を指定すると token が注入される
  - https://docs.page/marsidev/react-turnstile/get-widget-token#onsuccess-callback

## Vite

- config で`__dirname`を使う方法

  - https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/

- src ディレクトリ外にアクセスする方法
  - config で以下のように設定する
  ```js
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'utils'),
    },
  }
  ```

## Turnstile の処理の流れ

> ChatGPT

> ### フロントエンドでの検証
>
> - ウィジェットのレンダリング:
>
>   - ページが読み込まれると、Turnstile ウィジェットがレンダリングされ、「検証中」と表示されます。
>   - このとき、ウィジェットはユーザーのブラウザ上で様々なチェックを行い、ユーザーがボットでないかを判定しようとします。これには、ブラウザの特性やユーザーの行動パターンなどの信号を分析します。
>
> - 初期検証の成功:
>
>   - 数秒後に「成功しました！」と表示されるのは、初期のフロントエンド検証が成功したことを意味します。この段階で、ウィジェットはユーザーがボットである可能性が低いと判断します。
>   - この成功メッセージの背後では、Turnstile ウィジェットがトークンを生成し、ユーザーの入力フォームに隠しフィールドとしてトークンを挿入します。このトークンは、ユーザーの操作が完了するまで一時的に保持されます。
>
> ### バックエンドでの検証
>
> - フォームの送信:
>
>   - ユーザーがフォームを送信すると、Turnstile ウィジェットによって生成されたトークンもフォームデータと一緒に送信されます。
>
> - トークンの検証:
>
>   - バックエンドで、フォームデータと共に送信されたトークンを Cloudflare の Turnstile API に送信して検証を行います。
>
> - 検証結果の処理:
>
>   - Cloudflare のサーバーは、トークンの有効性をチェックし、ユーザーが本当にボットではないかを検証します。
>   - 検証が成功すると、サーバーからの応答には成功ステータスが含まれ、バックエンドはユーザーのフォーム送信を続行できます。失敗した場合、適切なエラーメッセージを表示して、ユーザーの入力を拒否します。
>
> ### 二重チェックが必要な理由
>
> - フロントエンド検証の限界:
>
>   - クライアントサイドの脆弱性: フロントエンドでの検証は、ユーザーのブラウザ上で実行されるため、悪意のあるユーザーやボットが検証プロセスをバイパスする可能性があります。JavaScript のコードは表示され、改ざんされる可能性があります。
>   - 信号の分析: フロントエンドでは、ブラウザ特性やユーザーの行動パターンを分析してボットでないことを確認しますが、これだけではすべてのボットを検出するのは難しい場合があります。
>
> - バックエンド検証の必要性:
>
>   - サーバーサイドの信頼性: サーバー側での検証は、トークンの有効性をクラウドフレアのサーバーで確認するため、フロントエンドでの改ざんを防ぐことができます。これにより、トークンが正しく生成され、改ざんされていないことを確認できます。
>   - セキュリティの強化: バックエンドでの検証により、フロントエンドでバイパスされた可能性のある検証を再度行うことで、より強固なセキュリティを提供します。
>
> - 二重チェックの効果
>
>   - フロントエンド検証の役割: フロントエンドでの検証は、ユーザー体験を向上させるためのもので、ユーザーがボットでないことを迅速に確認し、スムーズな操作を提供します。
>   - バックエンド検証の役割: バックエンドでの検証は、最終的なセキュリティチェックを行い、悪意のある操作を確実にブロックします。
>
> - フロントエンドとバックエンド検証の成功割合
>
>   - 具体的な割合は公開されていないため、一般的な推測になりますが、通常以下のような形で想定できます：
>
>   - フロントエンド検証: かなりの割合のボットを初期段階で除外します。例えば、80-90%のボットを検出することができます。
>   - バックエンド検証: フロントエンドを通過したボットを追加で検出するための最終チェックです。例えば、残りの 10-20%のボットを検出することができます。
