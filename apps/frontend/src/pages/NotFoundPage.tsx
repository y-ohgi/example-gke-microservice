import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main>
      <h1>ページが見つかりません</h1>
      <p>指定されたページは存在しません。URLをご確認ください。</p>
      <p>
        <Link to="/">商品一覧に戻る</Link>
      </p>
    </main>
  )
}
