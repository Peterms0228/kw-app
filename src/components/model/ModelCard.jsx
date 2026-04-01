import { useState } from 'react'
import { useInventory } from '../../context/InventoryContext'
import StockRow from '../stock/StockRow'
import AddStockRow from '../stock/AddStockRow'
import styles from './ModelCard.module.css'

export default function ModelCard({ model }) {
  const { deleteModel, getStocksForModel, manageMode } = useInventory()
  const [expanded, setExpanded]       = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const stocks   = getStocksForModel(model.id)
  const totalQty = stocks.reduce((s, st) => s + st.quantity, 0)

  if (!manageMode && confirmDelete) setConfirmDelete(false)

  return (
    <div className={`${styles.card} ${expanded ? styles.expanded : ''} ${manageMode ? styles.manageMode : ''}`}>

      {/* Header */}
      <button className={styles.header} onClick={() => setExpanded(e => !e)} aria-expanded={expanded}>
        <div className={styles.info}>
          <span className={styles.name}>{model.name}</span>
          <span className={styles.meta}>
            {stocks.length} {stocks.length === 1 ? 'stock' : 'stocks'} · {totalQty} items
          </span>
        </div>
        <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}>▾</span>
      </button>

      {/* Delete — manage mode only */}
      {manageMode && (
        <div className={styles.deleteArea}>
          {confirmDelete ? (
            <div className={styles.confirmRow}>
              <span className={styles.confirmText}>Are you sure?</span>
              <button className={styles.confirmYes} onClick={() => deleteModel(model.id)}>Yes, Delete</button>
              <button className={styles.confirmNo}  onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <button className={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>
              Delete This Model
            </button>
          )}
        </div>
      )}

      {/* Body */}
      {expanded && (
        <div className={styles.body}>
          {stocks.length === 0
            ? <p className={styles.empty}>{manageMode ? 'No stocks yet. Add one below.' : 'No stocks yet.'}</p>
            : <div className={styles.stockList}>
                {stocks.map(st => <StockRow key={st.id} stock={st} />)}
              </div>
          }
          {manageMode && <AddStockRow modelId={model.id} />}
        </div>
      )}
    </div>
  )
}
