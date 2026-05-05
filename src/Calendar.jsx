import { useMemo, useState } from 'react'

const DAYS = ['日', '月', '火', '水', '木', '金', '土']
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

function recordMatchesQuery(r, q) {
  if (!q.trim()) return true
  const s = q.trim().toLowerCase()
  const blob = [
    r.fish,
    r.location,
    r.lure,
    r.weather,
    r.tide,
    r.notes,
    r.episode,
    r.tackle,
    r.rod,
    r.reel,
    r.reflection,
    r.buyList,
    r.pointLabel,
    r.companionsText,
    r.heardFromFriends,
    r.nearbyAnglers,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return blob.includes(s)
}

function Calendar({ records, friendRecords, showFriendMock, searchQuery, onSearchQueryChange, onDayClick }) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())

  const mineFiltered = useMemo(() => records.filter(r => recordMatchesQuery(r, searchQuery)), [records, searchQuery])
  const friendFiltered = useMemo(() => {
    if (!showFriendMock) return []
    return friendRecords.filter(r => recordMatchesQuery(r, searchQuery))
  }, [friendRecords, showFriendMock, searchQuery])

  const markByDate = useMemo(() => {
    const m = {}
    mineFiltered.forEach(r => {
      m[r.date] = { mine: true, friend: m[r.date]?.friend }
    })
    friendFiltered.forEach(r => {
      m[r.date] = { friend: true, mine: m[r.date]?.mine }
    })
    return m
  }, [mineFiltered, friendFiltered])

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <input
          type="search"
          value={searchQuery}
          onChange={e => onSearchQueryChange(e.target.value)}
          placeholder="🔎 ワード検索（魚種・場所・潮・メモ…）"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />
        {(mineFiltered.length !== records.length || friendFiltered.length) && (
          <p style={{ fontSize: '11px', color: '#666', margin: '6px 0 0' }}>
            検索結果: 自分 {mineFiltered.length} 件
            {showFriendMock && ` · 友達サンプル ${friendFiltered.length} 件`}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button type="button" onClick={prevMonth} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>
          ‹
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          {currentYear}年 {MONTHS[currentMonth]}
        </span>
        <button type="button" onClick={nextMonth} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>
          ›
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: i === 0 ? '#e74c3c' : i === 6 ? '#3498db' : '#888', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
        {Array(daysInMonth)
          .fill(null)
          .map((_, i) => {
            const day = i + 1
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const mark = markByDate[dateStr]
            const hasMine = mark?.mine
            const hasFriend = mark?.friend
            const isToday = dateStr === today.toISOString().slice(0, 10)
            const dayOfWeek = (firstDay + i) % 7

            return (
              <div
                key={day}
                role="button"
                tabIndex={0}
                onClick={() => onDayClick(dateStr)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') onDayClick(dateStr)
                }}
                style={{
                  textAlign: 'center',
                  padding: '6px 2px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isToday ? '#0F6E56' : 'transparent',
                  color: isToday ? 'white' : dayOfWeek === 0 ? '#e74c3c' : dayOfWeek === 6 ? '#3498db' : '#333',
                  fontSize: '14px',
                  position: 'relative',
                }}
              >
                {day}
                {(hasMine || hasFriend) && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginTop: '2px' }}>
                    {hasMine && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isToday ? 'white' : '#0F6E56',
                        }}
                      />
                    )}
                    {hasFriend && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isToday ? '#ffe0b2' : '#f57c00',
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
      </div>

      <p style={{ fontSize: '11px', color: '#888', marginTop: '12px', lineHeight: 1.45 }}>
        <span style={{ color: '#0F6E56' }}>●</span> 自分の記録{' '}
        <span style={{ color: '#f57c00' }}>●</span> 友達（デモ）
      </p>
    </div>
  )
}

export default Calendar
