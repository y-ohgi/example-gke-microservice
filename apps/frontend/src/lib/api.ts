import type { Order, Product } from './types'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

async function requestJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new ApiError(res.status)
  }
  return (await res.json()) as T
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products')
  return requestJson<Product[]>(res)
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`)
  return requestJson<Product>(res)
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch('/api/orders')
  return requestJson<Order[]>(res)
}

export type CreateOrderInput = {
  productId: number
  quantity: number
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return requestJson<Order>(res)
}
