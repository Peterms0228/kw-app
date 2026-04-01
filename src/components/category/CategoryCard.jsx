import { useState } from 'react'
import { useInventory } from '../../context/InventoryContext'
import ModelCard from '../model/ModelCard'
import styles from './CategoryCard.module.css'

const AVATAR_COLORS = [
  '#1A56DB','#1A7A3A','#8B2FC9','#C25700',
  '#B5180D','#0F6E8C','#5A4A00','#1E6B5E',
]
function getColor(name) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

export default function CategoryCard({ category }) {
  const { deleteCategory, getModelsForCategory, addModel, manageMode } = useInventory()
  const [expanded, setExpanded]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [addingModel, setAddingModel]     = useState(false)
  const [newModelName, setNewModelName]   = useState('')
  const [saving, setSaving]              = useState(false)

  const childModels = getModelsForCategory(category.id)
  const color       = getColor(category.name)
  const initials    = getInitials(category.name)

  if (!manageMode && confirmDelete) setConfirmDelete(false)
  if (!manageMode && addingModel)   { setAddingModel(false); setNewModelName('') }

  const handleAddModel = async () => {
    if (!newModelName.trim()) return
    setSaving(true)
    await addModel(category.id, newModelName)
    setNewModelName(''); setAddingModel(false)
    setSaving(false)
  }

  return (
    <div className={`${styles.card} ${expanded ? styles.expanded : ''} ${manageMode ? styles.manageMode : ''}`}>

      {/* ── HEADER ── */}
      <div className={styles.cardHeader}>
        <div className={styles.avatar} style={{ background: color }}>{initials}</div>

        <button className={styles.infoBtn} onClick={() => setExpanded(e => !e)} aria-expanded={expanded}>
          <span className={styles.catName}>{category.name}</span>
          <span className={styles.catMeta}>
            {childModels.length} {childModels.length === 1 ? 'model' : 'models'}
          </span>
        </button>

        <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} onClick={() => setExpanded(e => !e)} aria-hidden>▾</span>
      </div>

      {/* ── MANAGE: delete category ── */}
      {manageMode && (
        <div className={styles.deleteArea}>
          {confirmDelete ? (
            <div className={styles.confirmRow}>
              <span className={styles.confirmText}>Delete "{category.name}" and all its models?</span>
              <button className={styles.confirmYes} onClick={() => deleteCategory(category.id)}>Yes, Delete</button>
              <button className={styles.confirmNo}  onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <button className={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>
              Delete This Category
            </button>
          )}
        </div>
      )}

      {/* ── BODY ── */}
      {expanded && (
        <div className={styles.body}>
          {childModels.length === 0
            ? <p className={styles.empty}>{manageMode ? 'No models yet. Add one below.' : 'No models yet.'}</p>
            : <div className={styles.modelList}>
                {childModels.map(m => <ModelCard key={m.id} model={m} />)}
              </div>
          }

          {/* Add model — manage mode only */}
          {manageMode && (
            <div className={styles.addModelArea}>
              {addingModel ? (
                <div className={styles.addModelForm}>
                  <input
                    className={styles.addModelInput}
                    type="text"
                    placeholder="e.g. iPhone 15 Pro Max…"
                    value={newModelName}
                    onChange={e => setNewModelName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddModel(); if (e.key === 'Escape') { setAddingModel(false); setNewModelName('') } }}
                    maxLength={80}
                    autoFocus
                    disabled={saving}
                  />
                  <div className={styles.addModelActions}>
                    <button className={styles.cancelBtn} onClick={() => { setAddingModel(false); setNewModelName('') }}>Cancel</button>
                    <button className={styles.saveBtn} onClick={handleAddModel} disabled={saving || !newModelName.trim()}>
                      {saving ? 'Saving…' : 'Add Model'}
                    </button>
                  </div>
                </div>
              ) : (
                <button className={styles.addModelBtn} onClick={() => setAddingModel(true)}>
                  + Add Model
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
