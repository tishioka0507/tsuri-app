import { useMemo, useState } from 'react'
import { FISH_LIST } from './constants'

function FishSpeciesView({ records, mockFriendRecords, filterScope }) {
  const [tab, setTab] = useState('species')
  const [selectedFish, setSelectedFish] = useState(FISH_LIST[0])
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [filterFish, setFilterFish] = useState('')
  const [filterTide, setFilterTide] = useState('')
  const [filterWeather, setFilterWeather] = useState('')

  const merged = useMemo(() => {
    const mine = records.map(r => ({ ...r, scope: 'mine' }))
    const friends = filterScope === 'mine' ? [] : mockFriendRecords.map(r => ({ ...r, scope: 'friend' }))
    if (filterScope === 'friends') return friends
    if (filterScope === 'all') return [...mine, ...friends]
    return mine
  }, [records, mockFriendRecords, filterScope])

  const filtered = useMemo(() => {
    return merged.filter(r => {
      if (filterFish && r.fish !== filterFish) return false
      if (filterTide && r.tide !== filterTide) return false
      if (filterWeather && r.weather !== filterWeather) return false
      return true
    })
  }, [merged, filterFish, filterTide, filterWeather])

  const byFish = useMemo(() => {
    const m = {}
    for (const r of filtered) {
      const f = r.fish || 'その他'
      if (!m[f]) m[f] = []
      m[f].push(r)
    }
    return m
  }, [filtered])

  const listForSelected = byFish[selectedFish] || []

  const yearCounts = useMemo(() => {
    const arr = Array(12).fill(0)
    for (const r of filtered) {
      if (!r.date.startsWith(year)) continue
      const m = Number(r.date.slice(5, 7)) - 1
      if (m >= 0 && m < 12) arr[m] += Number(r.count) || 1
    }
    const max = Math.max(1, ...arr)
    return { arr, max }
  }, [filtered, year])

  const ranking = useMemo(() => {
    const m = {}
    for (const r of filtered) {
      const f = r.fish || '—'
      m[f] = (m[f] || 0) + (Number(r.count) || 1)
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }, [filtered])

  const years = useMemo(() => {
    const ys = new Set()
    filtered.forEach(r => ys.add(r.date.slice(0, 4)))
    ;[String(new Date().getFullYear())].forEach(y => ys.add(y))
    return [...ys].sort().reverse()
  }, [filtered])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {[
          { id: 'species', label: '魚種ファイル' },
          { id: 'stats', label: '集計' },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              border: tab === t.id ? '2px solid #0F6E56' : '1px solid #ddd',
              background: tab === t.id ? '#E1F5EE' : 'white',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'species' && (
        <>
          <label style={{ fontSize: '11px', color: '#666' }}>魚種タブ</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', marginBottom: '12px' }}>
            {FISH_LIST.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFish(f)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '999px',
                  border: selectedFish === f ? '2px solid #0F6E56' : '1px solid #ddd',
                  background: selectedFish === f ? '#0F6E56' : 'white',
                  color: selectedFish === f ? 'white' : '#333',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                {f}
                {(byFish[f] || []).length ? ` (${(byFish[f] || []).length})` : ''}
              </button>
            ))}
          </div>
          <h3 style={{ fontSize: '14px', margin: '0 0 8px' }}>{selectedFish} の記録</h3>
          {listForSelected.length === 0 && <p style={{ fontSize: '13px', color: '#888' }}>この魚種の記録はまだありません</p>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {listForSelected.map(r => (
              <li key={r.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '10px', marginBottom: '8px', fontSize: '13px' }}>
                <strong>{r.date}</strong> {r.time && `· ${r.time}`}
                <div style={{ color: '#666', fontSize: '12px' }}>
                  {r.location || '—'} · {r.count ? `${r.count}${r.countUnit || ''}` : '—'}
                  {r.scope === 'friend' && <span style={{ color: '#1565c0' }}> · 友達</span>}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'stats' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <select value={year} onChange={e => setYear(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }}>
              {years.map(y => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
            <select value={filterFish} onChange={e => setFilterFish(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }}>
              <option value="">魚種フィルター（全て）</option>
              {FISH_LIST.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <select value={filterTide} onChange={e => setFilterTide(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }}>
              <option value="">潮（全て）</option>
              {['大潮', '中潮', '小潮', '長潮', '若潮', '上潮', '下潮'].map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
            <select value={filterWeather} onChange={e => setFilterWeather(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }}>
              <option value="">天気（全て）</option>
              {['晴れ', '曇り', '雨', '雪', '強風', '霧'].map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', marginBottom: '6px' }}>
            {year}年の月別（数量の合計・目安）
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px', marginBottom: '16px' }}>
            {yearCounts.arr.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ fontSize: '10px', color: '#666' }}>{v || ''}</div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '22px',
                    height: `${(v / yearCounts.max) * 90}px`,
                    minHeight: v ? '4px' : '0',
                    background: '#0F6E56',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <div style={{ fontSize: '10px', color: '#888' }}>{i + 1}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', marginBottom: '6px' }}>
            よく釣れた魚
          </div>
          <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '13px' }}>
            {ranking.slice(0, 12).map(([f, n]) => (
              <li key={f} style={{ marginBottom: '4px' }}>
                {f} … {n}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}

export default FishSpeciesView
