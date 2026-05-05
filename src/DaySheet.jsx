import { useMemo } from 'react'

function aggregateByFish(records) {
  const m = {}
  for (const r of records) {
    const key = r.fish || '—'
    const n = Number(r.count) || 0
    m[key] = (m[key] || 0) + (n || 1)
  }
  return Object.entries(m).sort((a, b) => b[1] - a[1])
}

function DaySheet({ date, records, trips, onClose, onAddRecord, onEditRecord, onViewDetail }) {
  const dayRecords = useMemo(() => records.filter(r => r.date === date), [records, date])
  const tripIds = [...new Set(dayRecords.map(r => r.tripId).filter(Boolean))]

  const summary = useMemo(() => aggregateByFish(dayRecords), [dayRecords])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 400,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '390px',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'white',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '17px' }}>{date}</h2>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#888' }}>
            ×
          </button>
        </div>

        {tripIds.length > 0 && (
          <div style={{ marginTop: '12px', padding: '10px', background: '#E1F5EE', borderRadius: '10px', fontSize: '12px' }}>
            <strong>釣行</strong> {tripIds.length} 件 ·{' '}
            {tripIds.map(tid => {
              const t = trips.find(x => x.id === tid)
              return <span key={tid}>{t?.title || tid.slice(-6)} </span>
            })}
          </div>
        )}

        {summary.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', marginBottom: '6px' }}>1日の合計（目安）</div>
            <div style={{ fontSize: '13px', color: '#333' }}>
              {summary.map(([fish, n]) => (
                <span key={fish} style={{ marginRight: '10px' }}>
                  {fish} {n}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onAddRecord()}
          style={{
            width: '100%',
            marginTop: '14px',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: '#0F6E56',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ＋ この日の記録を追加
        </button>

        <div style={{ marginTop: '16px', fontSize: '12px', fontWeight: 700, color: '#666' }}>記録一覧</div>
        {dayRecords.length === 0 && <p style={{ fontSize: '13px', color: '#888' }}>まだ記録がありません</p>}
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
          {dayRecords.map(r => (
            <li
              key={r.id}
              style={{
                border: '1px solid #eee',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => onViewDetail(r)}
                style={{ flex: 1, textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.fish}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {r.time || '—'} · {r.location || '場所未入力'} {r.count ? `· ${r.count}${r.countUnit || ''}` : ''}
                </div>
              </button>
              <button
                type="button"
                onClick={() => onEditRecord(r)}
                style={{ fontSize: '12px', border: '1px solid #0F6E56', color: '#0F6E56', borderRadius: '8px', padding: '6px 10px', background: 'white', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                編集
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DaySheet
