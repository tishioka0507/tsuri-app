import { useState } from 'react'

function LoginScreen({ onGuestLogin, onGoogleStub, onLineStub }) {
  const [nickname, setNickname] = useState('')

  return (
    <div
      style={{
        minHeight: '100vh',
        maxWidth: '390px',
        margin: '0 auto',
        padding: '32px 20px',
        boxSizing: 'border-box',
        background: '#f4f7f5',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <div style={{ fontSize: '48px' }}>🎣</div>
        <h1 style={{ fontSize: '20px', margin: '12px 0 4px', color: '#111' }}>釣り日誌 Hokkaido</h1>
        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>フェーズ1 · ローカル保存版</p>
      </div>

      <div style={{ marginTop: '40px', background: 'white', borderRadius: '14px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>ニックネーム</label>
        <input
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="例: 道東アングラー"
          style={{
            width: '100%',
            marginTop: '6px',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '15px',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          onClick={() => onGuestLogin(nickname.trim() || 'ゲスト')}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: '#0F6E56',
            color: 'white',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          はじめる（ローカル保存）
        </button>
      </div>

      <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
        Supabase 連携・クラウド同期は後から追加できます。<br />
        この端末のブラウザにデータが保存されます。
      </p>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={onGoogleStub}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', fontSize: '12px', cursor: 'pointer' }}
        >
          Google（準備中）
        </button>
        <button
          type="button"
          onClick={onLineStub}
          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', fontSize: '12px', cursor: 'pointer' }}
        >
          LINE（準備中）
        </button>
      </div>
    </div>
  )
}

export default LoginScreen
