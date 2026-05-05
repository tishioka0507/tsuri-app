import { useState } from 'react'

const emptySet = () => ({
  id: `set-${Date.now()}`,
  name: '新しいセット',
  rod: '',
  reel: '',
  line: '',
  leader: '',
  hook: '',
  lure: '',
})

function SettingsModal({
  open,
  onClose,
  profile,
  onSaveProfile,
  tackleSets,
  onSaveTackleSets,
  prefs,
  onSavePrefs,
  onLogout,
  onExport,
  onImport,
}) {
  const [nick, setNick] = useState(profile?.nickname || '')
  const [sets, setSets] = useState(tackleSets?.length ? tackleSets : [emptySet()])
  const [admin, setAdmin] = useState(!!prefs?.isAdmin)

  if (!open) return null

  function updateSet(i, patch) {
    setSets(prev => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)))
  }

  function addSet() {
    setSets(prev => [...prev, emptySet()])
  }

  function removeSet(i) {
    setSets(prev => (prev.length <= 1 ? prev : prev.filter((_, j) => j !== i)))
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 500,
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
          maxHeight: '88vh',
          overflowY: 'auto',
          background: 'white',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '18px 16px 28px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontWeight: 700, fontSize: '17px' }}>設定</span>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#888' }}>
            ×
          </button>
        </div>

        <section style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', marginBottom: '8px' }}>プロフィール</div>
          <input
            value={nick}
            onChange={e => setNick(e.target.value)}
            placeholder="ニックネーム"
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </section>

        <section style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56' }}>タックルデフォルト（複数セット）</span>
            <button type="button" onClick={addSet} style={{ fontSize: '12px', border: 'none', background: '#E1F5EE', color: '#0F6E56', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
              ＋追加
            </button>
          </div>
          {sets.map((s, i) => (
            <div key={s.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '10px', marginBottom: '10px', background: '#fafafa' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input value={s.name} onChange={e => updateSet(i, { name: e.target.value })} placeholder="セット名" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <button type="button" onClick={() => removeSet(i)} style={{ border: 'none', background: '#fee', color: '#c00', borderRadius: '8px', padding: '0 10px', cursor: 'pointer' }}>
                  削除
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <input value={s.rod} onChange={e => updateSet(i, { rod: e.target.value })} placeholder="ロッド" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <input value={s.reel} onChange={e => updateSet(i, { reel: e.target.value })} placeholder="リール" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <input value={s.line} onChange={e => updateSet(i, { line: e.target.value })} placeholder="ライン" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <input value={s.leader} onChange={e => updateSet(i, { leader: e.target.value })} placeholder="リーダー" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <input value={s.hook} onChange={e => updateSet(i, { hook: e.target.value })} placeholder="針" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <input value={s.lure} onChange={e => updateSet(i, { lure: e.target.value })} placeholder="ルアー" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', marginBottom: '8px' }}>表示デモ</div>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '10px', background: '#f9f9f9', borderRadius: '10px' }}>
            <span>友達の釣行（サンプル）をカレンダーに表示</span>
            <input
              type="checkbox"
              checked={!!prefs?.showFriendMock}
              onChange={e => onSavePrefs({ showFriendMock: e.target.checked })}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '10px', background: '#f9f9f9', borderRadius: '10px', marginTop: '8px' }}>
            <span>開発用：フィードバック管理モード</span>
            <input type="checkbox" checked={admin} onChange={e => setAdmin(e.target.checked)} />
          </label>
        </section>

        <button
          type="button"
          onClick={() => {
            onSaveProfile({ ...profile, nickname: nick.trim() || 'ゲスト' })
            onSaveTackleSets(sets)
            onSavePrefs({ isAdmin: admin })
            onClose()
          }}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#0F6E56', color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: '10px' }}
        >
          保存して閉じる
        </button>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <button type="button" onClick={onExport} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '12px' }}>
            JSONエクスポート
          </button>
          <button type="button" onClick={onImport} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '12px' }}>
            JSONインポート
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('ログアウトしますか？（この端末の保存データは残ります）')) {
              onLogout()
              onClose()
            }
          }}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', color: '#666', cursor: 'pointer' }}
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}

export default SettingsModal
