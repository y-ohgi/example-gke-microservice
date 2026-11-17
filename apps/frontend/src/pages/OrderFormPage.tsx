import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError, createOrder, fetchProduct } from '../lib/api'
import type { Product } from '../lib/types'

export default function OrderFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState('1')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    fetchProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 404) {
          setLoadError('指定された商品が見つかりません。')
        } else {
          setLoadError('商品情報の取得に失敗しました。時間をおいて再度お試しください。')
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!product) return

    const parsedQuantity = Number(quantity)
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setSubmitError('数量は1以上の整数で入力してください。')
      return
    }

    setSubmitError(null)
    setSubmitting(true)
    try {
      await createOrder({ productId: product.id, quantity: parsedQuantity })
      navigate('/orders')
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 404) {
        setSubmitError('商品が見つかりませんでした。一覧に戻ってやり直してください。')
      } else if (error instanceof ApiError && error.status === 400) {
        setSubmitError('数量が不正です。1以上の整数を入力してください。')
      } else {
        setSubmitError('注文の作成に失敗しました。時間をおいて再度お試しください。')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loadError) {
    return (
      <main>
        <h1>注文の作成</h1>
        <p role="alert">{loadError}</p>
        <p>
          <Link to="/">商品一覧に戻る</Link>
        </p>
      </main>
    )
  }

  if (!product) {
    return (
      <main>
        <h1>注文の作成</h1>
        <p>読み込み中です…</p>
      </main>
    )
  }

  return (
    <main>
      <h1>注文の作成</h1>

      <p>
        商品: {product.name}(価格: {product.price.toLocaleString('ja-JP')}円)
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="quantity">数量</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            aria-describedby={submitError ? 'quantity-error' : undefined}
            required
          />
        </div>

        {submitError && (
          <p id="quantity-error" role="alert">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? '注文を送信しています…' : '注文を確定する'}
        </button>
      </form>

      <p>
        <Link to="/">商品一覧に戻る</Link>
      </p>
    </main>
  )
}
