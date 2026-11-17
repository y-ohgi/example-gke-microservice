import { useEffect, useState } from 'react'
import { fetchOrders } from '../lib/api'
import type { Order } from '../lib/types'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchOrders()
      .then((data) => {
        if (!cancelled) setOrders(data)
      })
      .catch(() => {
        if (!cancelled) setError('注文履歴の取得に失敗しました。時間をおいて再度お試しください。')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main>
      <h1>注文履歴</h1>

      {error && <p role="alert">{error}</p>}
      {!error && orders === null && <p>読み込み中です…</p>}
      {!error && orders !== null && orders.length === 0 && <p>注文履歴はまだありません。</p>}

      {!error && orders !== null && orders.length > 0 && (
        <table>
          <caption>注文履歴一覧</caption>
          <thead>
            <tr>
              <th scope="col">注文日時</th>
              <th scope="col">商品名</th>
              <th scope="col">数量</th>
              <th scope="col">単価</th>
              <th scope="col">合計金額</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.createdAt).toLocaleString('ja-JP')}</td>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>{order.unitPrice.toLocaleString('ja-JP')}円</td>
                <td>{order.totalPrice.toLocaleString('ja-JP')}円</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
