import { useState } from 'react'
import Calendar from './Calendar'
import RecordForm from './RecordForm'

function App() {
  const [activeTab, setActiveTab] = useState('calendar')
  const [records, setRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  function handleDayClick(date) {
    setSelectedDate(date)
    setShowForm(true)
  }

  function handleSave(record) {
    setRecords([record, ...records])
    setShowForm(false)
  }

  function handleCancel() {
    setShowForm(false)
  }

  return (
    <div style={{ maxWidth: '390px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      {/* 記録フォーム */}
      {showForm && (
        <RecordForm
          date={selectedDate}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* ヘッダー */}
      <div style={{ padding: '16px', borderBottom: '1px solid #eee', backgroundColor: 'white' }}>
        <h1 style={{ fontSize: '18px', margin: 0 }}>🎣 釣り日誌 Hokkaido</h1>
        <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 0' }}>記録が、次の釣りを変える</p>
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', backgroundColor: '#f9f9f9' }}>
        {activeTab === 'calendar' && (
          <Calendar records={records} onDayClick={handleDayClick} />
        )}
        {activeTab === 'map' && <div><h2>🗺️ 地図</h2><p>ここに釣り場マップが表示されます</p></div>}
        {activeTab === 'fish' && <div><h2>🐟 魚種別</h2><p>ここに魚種別ファイルが表示されます</p></div>}
        {activeTab === 'weather' && <div><h2>🌊 天気</h2><p>ここに天気・海況が表示されます</p></div>}
        {activeTab === 'info' && <div><h2>🎣 釣り情報</h2><p>ここにAI提案・レシピが表示されます</p></div>}
      </div>

      {/* 下部タブバー */}
      <div style={{ display: 'flex', borderTop: '1px solid #eee', backgroundColor: 'white' }}>
        {[
          { id: 'calendar', label: 'カレンダー', icon: '📅' },
          { id: 'map', label: '地図', icon: '🗺️' },
          { id: 'fish', label: '魚種別', icon: '🐟' },
          { id: 'weather', label: '天気', icon: '🌊' },
          { id: 'info', label: '釣り情報', icon: '🎣' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '8px 0',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? '#0F6E56' : '#888',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              borderTop: activeTab === tab.id ? '2px solid #0F6E56' : '2px solid transparent',
            }}
          >
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App