import { useState, useEffect, useRef } from 'react'
import { useInventory } from '../../context/InventoryContext'
import styles from './Modal.module.css'

export default function Modal({ open, onClose }) {
  const { addCategory } = useInventory()
  const [name, setName]   = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setName(''); setTimeout(() => inputRef.current?.focus(), 200) }
  }, [open])

  const handleAdd = async () => {
    if (!name.trim()) return
    setLoading(true)
    await addCategory(name)
    setLoading(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet} role="dialog" aria-modal="true">
        <div className={styles.handle} />
        <h2 className={styles.title}>Add New Category</h2>
        <p className={styles.sub}>Enter a brand or group name (e.g. iPhone, Samsung).</p>

        <label className={styles.fieldLabel} htmlFor="cat-name-input">Category Name</label>
        <input
          id="cat-name-input"
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="e.g. iPhone, Samsung, Huawei…"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          disabled={loading}
          maxLength={80}
        />

        <div className={styles.actions}>
          <button className={styles.cancelBtn}  onClick={onClose}  disabled={loading}>Cancel</button>
          <button className={styles.confirmBtn} onClick={handleAdd} disabled={loading || !name.trim()}>
            {loading ? 'Saving…' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  )
}
