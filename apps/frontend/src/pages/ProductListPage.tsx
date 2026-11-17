import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/api'
import type { Product } from '../lib/types'

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch(() => {
        if (!cancelled) setError('商品一覧の取得に失敗しました。時間をおいて再度お試しください。')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main>
      <h1>商品一覧</h1>

      {error && <p role="alert">{error}</p>}
      {!error && products === null && <p>読み込み中です…</p>}
      {!error && products !== null && products.length === 0 && <p>商品がありません。</p>}

      {!error && products !== null && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>価格: {product.price.toLocaleString('ja-JP')}円</p>
              <p>在庫: {product.stock}個</p>
              <Link to={`/products/${product.id}/order`}>{product.name}を注文する</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
