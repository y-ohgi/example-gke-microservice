import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, test, vi } from 'vitest'
import ProductListPage from './ProductListPage'

describe('ProductListPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('商品一覧を表示する', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([{ id: 1, name: 'コーヒー豆 200g', price: 1200, stock: 50 }]),
          { status: 200 },
        ),
      ),
    )

    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('コーヒー豆 200g')).toBeInTheDocument()
    expect(screen.getByText(/1,200円/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'コーヒー豆 200gを注文する' })).toHaveAttribute(
      'href',
      '/products/1/order',
    )
  })

  test('取得に失敗した場合はエラーメッセージを表示する', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })))

    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('商品一覧の取得に失敗しました')
  })
})
