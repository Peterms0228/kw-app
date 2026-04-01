import { useState } from 'react'
import { useInventory } from '../context/InventoryContext'
import CategoryList from '../components/category/CategoryList'
import Modal from '../components/ui/Modal'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { manageMode } = useInventory()
  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className={styles.page}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search categories"
        />
        {search && (
          <button className={styles.clearBtn} onClick={() => setSearch('')} aria-label="Clear">✕</button>
        )}
      </div>

      {/* List */}
      <div className={`${styles.content} ${manageMode ? styles.contentManage : ''}`}>
        <CategoryList search={search} />
      </div>

      {/* FAB — manage mode only */}
      {manageMode && (
        <div className={styles.fabArea}>
          <button className={styles.fab} onClick={() => setModalOpen(true)}>
            + Add New Category
          </button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
