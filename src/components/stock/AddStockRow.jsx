import { useState } from 'react'
import { useInventory } from '../../context/InventoryContext'
import styles from './AddStockRow.module.css'

export default function AddStockRow({ modelId }) {
  const { addStock } = useInventory()
  const [name, setName]     = useState('')
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen]     = useState(false)

  const handleAdd = async () => {
    if (!name.trim()) return
    setLoading(true)
    await addStock(modelId, name, remark)
    setName(''); setRemark(''); setOpen(false)
    setLoading(false)
  }

  if (!open) {
    return (
      <div className={styles.closedWrap}>
        <button className={styles.openBtn} onClick={() => setOpen(true)}>
          + Add Stock
        </button>
      </div>
    )
  }

  return (
    <div className={styles.form}>
      <div className={styles.fieldLabel}>Stock Name</div>
      <input
        className={styles.input}
        type="text"
        placeholder="e.g. Rubber, Steel, Full Case…"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        maxLength={80}
        autoFocus
        disabled={loading}
      />
      <div className={styles.fieldLabel}>
        Remark <span className={styles.optional}>(optional · {remark.length}/100)</span>
      </div>
      <input
        className={styles.input}
        type="text"
        placeholder="e.g. Imported from Thailand…"
        value={remark}
        onChange={e => setRemark(e.target.value.slice(0, 100))}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        maxLength={100}
        disabled={loading}
      />
      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={() => { setOpen(false); setName(''); setRemark('') }}>
          Cancel
        </button>
        <button className={styles.addBtn} onClick={handleAdd} disabled={loading || !name.trim()}>
          {loading ? 'Saving…' : 'Add Stock'}
        </button>
      </div>
    </div>
  )
}
