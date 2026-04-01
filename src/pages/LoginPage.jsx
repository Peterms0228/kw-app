import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login, error, setError } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    await login(email, password)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoWrap}>
          <h1 className={styles.logoText}>Kemwan</h1>
          <p className={styles.logoSub}>Inventory Management</p>
        </div>

        {/* Form */}
        <div className={styles.form}>
          {error && (
            <div className={styles.errorBanner} role="alert">
              ⚠️ {error}
            </div>
          )}

          <label className={styles.label} htmlFor="email-input">
            Email Address
          </label>
          <input
            id="email-input"
            className={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            disabled={loading}
            autoComplete="email"
            inputMode="email"
          />

          <label className={styles.label} htmlFor="password-input">
            Password
          </label>
          <div className={styles.passwordWrap}>
            <input
              id="password-input"
              className={`${styles.input} ${styles.passwordInput}`}
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              className={styles.showPassBtn}
              type="button"
              onClick={() => setShowPass(p => !p)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            className={styles.loginBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>

      </div>
    </div>
  )
}
