import { useInventory } from '../../context/InventoryContext'
import styles from './Toast.module.css'

export default function Toast() {
  const { toast } = useInventory()

  if (!toast) return null

  return (
    <div className={`${styles.toast} ${styles[toast.type] ?? ''}`}>
      {toast.type === 'error' ? '⚠️' : '✅'} {toast.message}
    </div>
  )
}
