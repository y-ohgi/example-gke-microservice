import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, test, vi } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('未定義のパスでは404ページを表示する', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 })))

    render(
      <MemoryRouter initialEntries={['/no-such-page']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText('ページが見つかりません')).toBeInTheDocument()
  })
})
