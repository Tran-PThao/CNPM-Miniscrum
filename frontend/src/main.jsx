import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Giữ lại dòng này để không bị vỡ giao diện
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext' // Sửa lại 'context' không có 's' cho đúng folder của bạn

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)