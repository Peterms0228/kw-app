import { useState } from 'react'
import { useInventory } from '../../context/InventoryContext'
import styles from './StockRow.module.css'

export default function StockRow({ stock }) {
  const { updateQuantity, deleteStock, updateRemark, manageMode } = useInventory()
  const [editingRemark, setEditingRemark] = useState(false)
  const [remarkDraft, setRemarkDraft] = useState(stock.remark ?? '')

  const saveRemark = () => {
    updateRemark(stock.id, remarkDraft)
    setEditingRemark(false)
  }

  return (
    <div className={styles.row}>
      {/* Top row: name + qty + delete */}
      <div className={styles.topRow}>
        <div className={styles.name}>{stock.name}</div>

        <div className={styles.right}>
          <div className={styles.qtyControl}>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQuantity(stock.id, -1)}
              disabled={stock.quantity === 0}
              aria-label="Decrease"
            >−</button>
            <span className={styles.qty}>{stock.quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => updateQuantity(stock.id, 1)}
              aria-label="Increase"
            >+</button>
          </div>

          {manageMode && (
            <button
              className={styles.deleteBtn}
              onClick={() => deleteStock(stock.id)}
            >Delete</button>
          )}
        </div>
      </div>

      {/* Remark row */}
      <div className={styles.remarkRow}>
        {editingRemark ? (
          <div className={styles.remarkEditWrap}>
            <input
              className={styles.remarkInput}
              value={remarkDraft}
              onChange={e => setRemarkDraft(e.target.value.slice(0, 100))}
              onKeyDown={e => { if (e.key === 'Enter') saveRemark(); if (e.key === 'Escape') setEditingRemark(false) }}
              maxLength={100}
              autoFocus
              placeholder="Add a remark…"
            />
            <span className={styles.charCount}>{remarkDraft.length}/100</span>
            <button className={styles.saveRemarkBtn} onClick={saveRemark}>Save</button>
          </div>
        ) : (
          <button className={styles.remarkDisplay} onClick={() => { setRemarkDraft(stock.remark ?? ''); setEditingRemark(true) }}>
            {stock.remark
              ? <span className={styles.remarkText}>📝 {stock.remark}</span>
              : <span className={styles.remarkPlaceholder}>Tap to add remark…</span>
            }
          </button>
        )}
      </div>
    </div>
  )
}
