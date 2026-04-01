import { useInventory } from '../../context/InventoryContext'
import { useAuth } from '../../context/AuthContext'
import styles from './Header.module.css'

export default function Header() {
  const { manageMode, toggleManageMode } = useInventory()
  const { logout } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.title}>Kemwan</div>
        
        <div className={styles.actions}>
          <button
            className={`${styles.manageBtn} ${manageMode ? styles.manageBtnActive : ''}`}
            onClick={toggleManageMode}
            aria-pressed={manageMode}
          >
            {manageMode ? 'Done' : 'Manage'}
          </button>

          <button className={styles.logoutBtn} onClick={logout} aria-label="Sign out">
            Sign Out
          </button>
        </div>
      </div>
      {manageMode && (
        <div className={styles.manageBanner}>
          ✏️ Manage Mode — you can add or delete categories, models and stocks
        </div>
      )}
    </header>
  )
}
