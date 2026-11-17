import { Link, Route, Routes } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import OrderFormPage from './pages/OrderFormPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import ProductListPage from './pages/ProductListPage'

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">商品一覧</Link>
          </li>
          <li>
            <Link to="/orders">注文履歴</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id/order" element={<OrderFormPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
