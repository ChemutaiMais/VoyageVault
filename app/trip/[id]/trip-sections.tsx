"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Receipt, PiggyBank, BookHeart, Map, ImagePlus, X } from "lucide-react"
import type { Trip } from "@/lib/trips"
import styles from "./trip.module.css"

const TripMap = dynamic(() => import("./trip-map"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading map…</div>,
})

type SectionKey = "expenses" | "budget" | "memory" | "maps"

const sections: { key: SectionKey; label: string; Icon: typeof Receipt }[] = [
  { key: "expenses", label: "Expenses", Icon: Receipt },
  { key: "budget", label: "Budget", Icon: PiggyBank },
  { key: "memory", label: "Memory", Icon: BookHeart },
  { key: "maps", label: "Maps", Icon: Map },
]

const tabActiveClass: Record<SectionKey, string> = {
  expenses: styles.expensesActive,
  budget: styles.budgetActive,
  memory: styles.memoryActive,
  maps: styles.mapsActive,
}

const iconClass: Record<SectionKey, string> = {
  expenses: styles.iconExpenses,
  budget: styles.iconBudget,
  memory: styles.iconMemory,
  maps: styles.iconMaps,
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "Ksh", maximumFractionDigits: 0 })
}

export default function TripSections({ trip }: { trip: Trip }) {
  const [active, setActive] = useState<SectionKey>("expenses")
  const [photos, setPhotos] = useState<{ id: string; url: string; caption: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const spent = trip.expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = trip.budget - spent
  const percent = Math.min(100, Math.round((spent / trip.budget) * 100))

  const ActiveIcon = sections.find((s) => s.key === active)!.Icon

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = () => {
        setPhotos((prev) => [
          { id: `${file.name}-${Date.now()}-${Math.random()}`, url: reader.result as string, caption: file.name },
          ...prev,
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label="Trip sections">
        {sections.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={`${styles.tab} ${active === key ? `${styles.tabActive} ${tabActiveClass[key]}` : ""}`}
            onClick={() => setActive(key)}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className={styles.panel} role="tabpanel">
        <div className={styles.panelHeader}>
          <span className={`${styles.panelIcon} ${iconClass[active]}`}>
            <ActiveIcon size={20} aria-hidden="true" />
          </span>
          <h2 className={styles.panelTitle}>{sections.find((s) => s.key === active)!.label}</h2>
        </div>

        {active === "expenses" && (
          <div>
            {trip.expenses.map((expense) => (
              <div key={expense.label} className={styles.expenseRow}>
                <div>
                  <p className={styles.expenseLabel}>{expense.label}</p>
                  <p className={styles.expenseCategory}>{expense.category}</p>
                </div>
                <span className={styles.expenseAmount}>{formatCurrency(expense.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {active === "budget" && (
          <div>
            <div className={styles.budgetSummary}>
              <div className={styles.budgetStat}>
                <p className={styles.budgetStatLabel}>Total Budget</p>
                <p className={styles.budgetStatValue}>{formatCurrency(trip.budget)}</p>
              </div>
              <div className={styles.budgetStat}>
                <p className={styles.budgetStatLabel}>Spent</p>
                <p className={styles.budgetStatValue}>{formatCurrency(spent)}</p>
              </div>
              <div className={styles.budgetStat}>
                <p className={styles.budgetStatLabel}>Remaining</p>
                <p className={styles.budgetStatValue}>{formatCurrency(remaining)}</p>
              </div>
            </div>
            <div className={styles.barTrack} aria-hidden="true">
              <div className={styles.barFill} style={{ width: `${percent}%` }} />
            </div>
            <p className={styles.mapCaption}>{percent}% of your budget used so far.</p>
          </div>
        )}

        {active === "memory" && (
          <div>
            <div className={styles.memoryUpload}>
              <button type="button" className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
                <ImagePlus size={18} aria-hidden="true" />
                Add Photos
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className={styles.hiddenInput}
                onChange={(e) => {
                  handleFiles(e.target.files)
                  e.target.value = ""
                }}
              />
              <p className={styles.uploadHint}>Save snapshots from your journey to this memory board.</p>
            </div>

            {photos.length > 0 && (
              <div className={styles.photoGrid}>
                {photos.map((photo) => (
                  <figure key={photo.id} className={styles.photoItem}>
                    {/* user-uploaded data URL, next/image not suitable */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url || "/placeholder.svg"} alt={photo.caption} className={styles.photoImg} />
                    <button
                      type="button"
                      className={styles.photoRemove}
                      onClick={() => removePhoto(photo.id)}
                      aria-label={`Remove ${photo.caption}`}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </figure>
                ))}
              </div>
            )}

            {trip.memories.map((memory) => (
              <article key={memory.title} className={styles.memoryEntry}>
                <p className={styles.memoryDate}>{memory.date}</p>
                <h3 className={styles.memoryTitle}>{memory.title}</h3>
                <p className={styles.memoryNote}>{memory.note}</p>
              </article>
            ))}
          </div>
        )}

        {active === "maps" && (
          <div>
            <div className={styles.mapWrap}>
              <TripMap coords={trip.coords} name={trip.name} location={trip.location} />
            </div>
            <p className={styles.mapCaption}>
              An interactive map of {trip.location}. Drag to explore and click the marker for details.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
