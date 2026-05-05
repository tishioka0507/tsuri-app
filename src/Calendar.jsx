import { useState } from 'react'

const DAYS = ['日', '月', '火', '水', '木', '金', '土']
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

function Calendar({ records, onDayClick }) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())

  // その月の日数と最初の曜日を計算
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // 釣果がある日を取得
  const recordDates = records.map(r => r.date)

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  return (
    <div>
      {/* 月の切り替え */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button onClick={prevMonth} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>‹</button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{currentYear}年 {MONTHS[currentMonth]}</span>
        <button onClick={nextMonth} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>›</button>
      </div>

      {/* 曜日ヘッダー */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: i === 0 ? '#e74c3c' : i === 6 ? '#3498db' : '#888', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* カレンダーのマス */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {Array(firstDay).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasRecord = recordDates.includes(dateStr)
          const isToday = dateStr === today.toISOString().slice(0, 10)
          const dayOfWeek = (firstDay + i) % 7

          return (
            <div
              key={day}
              onClick={() => onDayClick(dateStr)}
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
              {hasRecord && (
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  backgroundColor: isToday ? 'white' : '#0F6E56',
                  margin: '2px auto 0',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar