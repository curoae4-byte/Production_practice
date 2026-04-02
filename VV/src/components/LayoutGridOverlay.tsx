import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'vv-layout-grid-visible'

/**
 * ровно та же геометрия, что у {@link PageShell}:
 * центрированный блок max-w-7xl + горизонтальные поля px-4 sm:px-6 lg:px-8.
 */
export function LayoutGridOverlay() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      if (new URLSearchParams(window.location.search).get('grid') === '1') return true
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  const toggle = useCallback(() => {
    setVisible((v) => {
      const next = !v
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'g') {
        const t = e.target as HTMLElement | null
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  return (
    <>
      <div
        className={`fixed inset-0 z-[1100] flex justify-center transition-opacity duration-200 ${
          visible ? 'pointer-events-none opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden
      >
        {/*
          Дублируем разметку PageShell: один блок = max-w-7xl + px.
          Внешняя рамка — граница всего контейнера (как у обёртки в коде).
          Внутренний блок на всю ширину между паддингами + border-x — линии «живого» контента.
        */}
        <div className="relative flex h-full min-h-screen w-full max-w-7xl flex-col border-x border-dashed border-white/20 px-4 sm:px-6 lg:px-8">
          {/* Ровно та же внутренняя ширина, что у children в PageShell */}
          <div className="relative h-full min-h-screen w-full border-x-2 border-dashed border-[#EB0000]/55 bg-[rgba(235,0,0,0.04)]">
            <div className="pointer-events-none absolute inset-x-0 top-3 z-[1] px-2 font-['Montserrat'] text-[9px] leading-snug text-white/50 sm:text-[10px]">
              <p className="uppercase tracking-[0.2em] text-[#EB0000]/90">PageShell</p>
              <p className="mt-1 text-white/45">
                <span className="text-white/70">max-w-7xl</span> (1280px max) ·{' '}
                <span className="text-white/70">px-4 / sm:px-6 / lg:px-8</span>
              </p>
              <p className="mt-1 text-[8px] text-white/35 sm:text-[9px]">
                Светлая пунктир снаружи — край контейнера · красная полоса — где лежит контент
              </p>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[1] px-2 text-center font-['Montserrat'] text-[8px] uppercase tracking-[0.25em] text-white/35 sm:text-[9px]">
              Узкие колонки текста (напр. Hero max-w-6xl) — дополнительно внутри этой зоны
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        className={`fixed bottom-5 left-5 z-[12000] rounded border px-3 py-2 font-['Montserrat'] text-[10px] uppercase tracking-[0.2em] transition-colors ${
          visible
            ? 'border-[#EB0000] bg-[#EB0000]/20 text-white'
            : 'border-white/20 bg-black/50 text-white/60 hover:border-[#EB0000]/60 hover:text-white'
        }`}
        title="Разметка PageShell: вкл/выкл (Shift+G)"
      >
        Разметка
      </button>
    </>
  )
}

export default LayoutGridOverlay
