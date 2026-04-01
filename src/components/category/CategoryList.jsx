import { useInventory } from '../../context/InventoryContext'
import CategoryCard from './CategoryCard'
import styles from './CategoryList.module.css'

export default function CategoryList({ search }) {
  const { categories, loading } = useInventory()

  if (loading) return <div className={styles.loading}>Loading…</div>

  const filtered = search.trim()
    ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories

  if (filtered.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>{search ? '🔍' : '📦'}</div>
        <p className={styles.emptyTitle}>{search ? 'No categories found' : 'No categories yet'}</p>
        <p className={styles.emptySub}>{search ? 'Try a different search.' : 'Tap "Manage" then "Add New Category" to get started.'}</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      <p className={styles.label}>{filtered.length} {filtered.length === 1 ? 'Category' : 'Categories'}</p>
      {filtered.map(c => <CategoryCard key={c.id} category={c} />)}
    </div>
  )
}
