import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, test, vi } from 'vitest'
import OrderHistoryPage from './OrderHistoryPage'

describe('OrderHistoryPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('注文履歴を表の形式で表示する', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            {
              id: 1,
              productId: 1,
              productName: 'コーヒー豆 200g',
              quantity: 2,
              unitPrice: 1200,
              totalPrice: 2400,
              createdAt: '2026-01-01T00:00:00Z',
            },
          ]),
          { status: 200 },
        ),
      ),
    )

    render(
      <MemoryRouter>
        <OrderHistoryPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByText('コーヒー豆 200g')).toBeInTheDocument()
    expect(screen.getByText(/2,400円/)).toBeInTheDocument()
  })

  test('注文が無い場合はその旨を表示する', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 })))

    render(
      <MemoryRouter>
        <OrderHistoryPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('注文履歴はまだありません。')).toBeInTheDocument()
  })
})
