import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, test, vi } from 'vitest'
import OrderFormPage from './OrderFormPage'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/products/1/order']}>
      <Routes>
        <Route path="/products/:id/order" element={<OrderFormPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('OrderFormPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    navigateMock.mockClear()
  })

  test('商品情報を表示し、注文確定で注文履歴へ遷移する', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ id: 1, name: 'コーヒー豆 200g', price: 1200, stock: 50 }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 1,
            productId: 1,
            productName: 'コーヒー豆 200g',
            quantity: 2,
            unitPrice: 1200,
            totalPrice: 2400,
            createdAt: '2026-01-01T00:00:00Z',
          }),
          { status: 201 },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    renderPage()

    expect(await screen.findByText(/コーヒー豆 200g/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('数量'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: '注文を確定する' }))

    await vi.waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/orders')
    })
  })

  test('商品が見つからない場合はエラーメッセージを表示する', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))

    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('指定された商品が見つかりません')
  })
})
