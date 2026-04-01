import { AuthProvider, useAuth } from './context/AuthContext'
import { InventoryProvider } from './context/InventoryContext'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Toast from './components/ui/Toast'

function AppInner() {
  const { loggedIn } = useAuth()

  if (!loggedIn) return <LoginPage />

  return (
    <InventoryProvider>
      <Header />
      <HomePage />
      <Toast />
    </InventoryProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
