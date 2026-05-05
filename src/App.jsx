import { useCallback, useEffect, useMemo, useState } from 'react'
import Calendar from './Calendar'
import RecordForm from './RecordForm'
import MapView from './MapView'
import FishSpeciesView from './FishSpeciesView'
import WeatherView from './WeatherView'
import InfoHub from './InfoHub'
import Splash from './Splash'
import LoginScreen from './LoginScreen'
import SettingsModal from './SettingsModal'
import DaySheet from './DaySheet'
import RecordDetail from './RecordDetail'
import { MOCK_FRIEND_RECORDS } from './constants'
import { STORAGE_KEYS, loadJSON, saveJSON } from './lib/storage'

function readProfileFromStorage() {
  return loadJSON(STORAGE_KEYS.profile, null)
}

function App() {
  const [phase, setPhase] = useState('splash')
  const [activeTab, setActiveTab] = useState('calendar')
  const [records, setRecords] = useState(() => loadJSON(STORAGE_KEYS.records, []))
  const [trips, setTrips] = useState(() => loadJSON(STORAGE_KEYS.trips, []))
  const [profile, setProfile] = useState(() => loadJSON(STORAGE_KEYS.profile, null))
  const [tackleSets, setTackleSets] = useState(() => loadJSON(STORAGE_KEYS.tackleSets, []))
  const [recipes, setRecipes] = useState(() => loadJSON(STORAGE_KEYS.recipes, []))
  const [notes, setNotes] = useState(() => loadJSON(STORAGE_KEYS.notes, []))
  const [feedbacks, setFeedbacks] = useState(() => loadJSON(STORAGE_KEYS.feedbacks, []))
  const [groupLog, setGroupLog] = useState(() => loadJSON(STORAGE_KEYS.groupLog, []))
  const [prefs, setPrefs] = useState(() =>
    loadJSON(STORAGE_KEYS.prefs, { showFriendMock: true, isAdmin: false, filterScope: 'mine' }),
  )

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetDate, setSheetDate] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [editingRecord, setEditingRecord] = useState(null)
  const [detailRecord, setDetailRecord] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase(prev => {
        if (prev !== 'splash') return prev
        const p = readProfileFromStorage()
        return p?.nickname ? 'app' : 'login'
      })
    }, 1100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    saveJSON(STORAGE_KEYS.records, records)
  }, [records])
  useEffect(() => {
    saveJSON(STORAGE_KEYS.trips, trips)
  }, [trips])
  useEffect(() => {
    if (profile) saveJSON(STORAGE_KEYS.profile, profile)
  }, [profile])
  useEffect(() => {
    saveJSON(STORAGE_KEYS.tackleSets, tackleSets)
  }, [tackleSets])
  useEffect(() => {
    saveJSON(STORAGE_KEYS.recipes, recipes)
  }, [recipes])
  useEffect(() => {
    saveJSON(STORAGE_KEYS.notes, notes)
  }, [notes])
  useEffect(() => {
    saveJSON(STORAGE_KEYS.feedbacks, feedbacks)
  }, [feedbacks])
  useEffect(() => {
    saveJSON(STORAGE_KEYS.groupLog, groupLog)
  }, [groupLog])
  useEffect(() => {
    saveJSON(STORAGE_KEYS.prefs, prefs)
  }, [prefs])

  const tripOptionsForSelectedDate = useMemo(() => trips.filter(t => t.date === selectedDate), [trips, selectedDate])

  const handleGuestLogin = useCallback(nick => {
    const prof = { nickname: nick, provider: 'guest', at: Date.now() }
    saveJSON(STORAGE_KEYS.profile, prof)
    setProfile(prof)
    setTackleSets(prev =>
      prev.length
        ? prev
        : [
            {
              id: `set-${Date.now()}`,
              name: 'メインセット',
              rod: '',
              reel: '',
              line: '',
              leader: '',
              hook: '',
              lure: '',
            },
          ],
    )
    setPhase('app')
  }, [])

  const handleLogout = useCallback(() => {
    setProfile(null)
    localStorage.removeItem(STORAGE_KEYS.profile)
    setPhase('login')
  }, [])

  const handleDayClick = useCallback(date => {
    setSheetDate(date)
    setSheetOpen(true)
  }, [])

  const handleSaveRecord = useCallback((record, meta) => {
    setRecords(prev => {
      const i = prev.findIndex(r => r.id === record.id)
      if (i >= 0) {
        const n = [...prev]
        n[i] = record
        return n
      }
      return [record, ...prev]
    })
    if (meta?.isNewTrip) {
      setTrips(prev => (prev.some(t => t.id === record.tripId) ? prev : [...prev, { id: record.tripId, date: record.date, title: '', createdAt: Date.now() }]))
    }
    setShowForm(false)
    setEditingRecord(null)
  }, [])

  const handleDeleteRecord = useCallback(rec => {
    setRecords(prev => prev.filter(r => r.id !== rec.id))
    setDetailRecord(null)
  }, [])

  const exportAll = useCallback(() => {
    const blob = new Blob(
      [
        JSON.stringify(
          { records, trips, tackleSets, recipes, notes, feedbacks, groupLog, prefs, exportedAt: new Date().toISOString() },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `tsuri-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [records, trips, tackleSets, recipes, notes, feedbacks, groupLog, prefs])

  const importAll = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result))
          if (Array.isArray(data.records)) setRecords(data.records)
          if (Array.isArray(data.trips)) setTrips(data.trips)
          if (Array.isArray(data.tackleSets)) setTackleSets(data.tackleSets)
          if (Array.isArray(data.recipes)) setRecipes(data.recipes)
          if (Array.isArray(data.notes)) setNotes(data.notes)
          if (Array.isArray(data.feedbacks)) setFeedbacks(data.feedbacks)
          if (Array.isArray(data.groupLog)) setGroupLog(data.groupLog)
          if (data.prefs && typeof data.prefs === 'object') setPrefs(p => ({ ...p, ...data.prefs }))
          alert('インポートしました')
        } catch {
          alert('JSONの形式が正しくありません')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  if (phase === 'splash') {
    return <Splash />
  }

  if (phase === 'login') {
    return (
      <LoginScreen
        onGuestLogin={handleGuestLogin}
        onGoogleStub={() => alert('Googleログインは Supabase / OAuth 連携でフェーズ1後半〜2で実装予定です。')}
        onLineStub={() => alert('LINEログインは同上で実装予定です。')}
      />
    )
  }

  return (
    <div style={{ maxWidth: '390px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      {showForm && (
        <RecordForm
          key={`form-${selectedDate}-${editingRecord?.id ?? 'new'}`}
          date={selectedDate}
          tripOptions={tripOptionsForSelectedDate}
          initialRecord={editingRecord}
          tackleSets={tackleSets}
          onSave={handleSaveRecord}
          onCancel={() => {
            setShowForm(false)
            setEditingRecord(null)
          }}
        />
      )}

      {sheetOpen && (
        <DaySheet
          date={sheetDate}
          records={records}
          trips={trips}
          onClose={() => setSheetOpen(false)}
          onAddRecord={() => {
            setSelectedDate(sheetDate)
            setEditingRecord(null)
            setSheetOpen(false)
            setShowForm(true)
          }}
          onEditRecord={r => {
            setSelectedDate(r.date)
            setEditingRecord(r)
            setSheetOpen(false)
            setShowForm(true)
          }}
          onViewDetail={r => {
            setDetailRecord(r)
          }}
        />
      )}

      {detailRecord && (
        <RecordDetail
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
          onEdit={r => {
            setDetailRecord(null)
            setSelectedDate(r.date)
            setEditingRecord(r)
            setShowForm(true)
          }}
          onDelete={r => {
            handleDeleteRecord(r)
            setDetailRecord(null)
          }}
        />
      )}

      <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '17px', margin: 0 }}>🎣 釣り日誌 Hokkaido</h1>
          <p style={{ fontSize: '11px', color: '#888', margin: '2px 0 0' }}>こんにちは、{profile?.nickname || 'ゲスト'}</p>
        </div>
        <button type="button" onClick={() => setSettingsOpen(true)} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '8px 10px', background: 'white', cursor: 'pointer', fontSize: '12px' }}>
          設定
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px', backgroundColor: '#f9f9f9' }}>
        {activeTab === 'calendar' && (
          <Calendar
            records={records}
            friendRecords={MOCK_FRIEND_RECORDS}
            showFriendMock={!!prefs.showFriendMock}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onDayClick={handleDayClick}
          />
        )}
        {activeTab === 'map' && (
          <MapView records={records} mockFriendRecords={MOCK_FRIEND_RECORDS} showFriendMock={!!prefs.showFriendMock} />
        )}
        {activeTab === 'fish' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', fontSize: '12px' }}>
              {[
                { id: 'mine', label: '自分のみ' },
                { id: 'friends', label: '友達サンプル' },
                { id: 'all', label: '両方' },
              ].map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setPrefs(p => ({ ...p, filterScope: o.id }))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '10px',
                    border: prefs.filterScope === o.id ? '2px solid #0F6E56' : '1px solid #ddd',
                    background: prefs.filterScope === o.id ? '#E1F5EE' : 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <FishSpeciesView records={records} mockFriendRecords={MOCK_FRIEND_RECORDS} filterScope={prefs.filterScope || 'mine'} />
          </div>
        )}
        {activeTab === 'weather' && <WeatherView />}
        {activeTab === 'info' && (
          <InfoHub
            recipes={recipes}
            setRecipes={setRecipes}
            notes={notes}
            setNotes={setNotes}
            feedbacks={feedbacks}
            setFeedbacks={setFeedbacks}
            groupLog={groupLog}
            setGroupLog={setGroupLog}
            prefs={prefs}
          />
        )}
      </div>

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
            type="button"
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

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
        tackleSets={tackleSets}
        onSaveTackleSets={setTackleSets}
        prefs={prefs}
        onSavePrefs={patch => setPrefs(p => ({ ...p, ...patch }))}
        onLogout={handleLogout}
        onExport={exportAll}
        onImport={importAll}
      />
    </div>
  )
}

export default App
