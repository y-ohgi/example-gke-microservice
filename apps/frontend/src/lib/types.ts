export type Product = {
  id: number
  name: string
  price: number
  stock: number
}

export type Order = {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: string
}
