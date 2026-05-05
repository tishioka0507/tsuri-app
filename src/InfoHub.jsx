import { useMemo, useState } from 'react'
import { FISH_LIST } from './constants'

const QUICK = [
  { emoji: '🐟', label: '釣れた！', key: 'catch' },
  { emoji: '👀', label: 'チェイス', key: 'chase' },
  { emoji: '🐠', label: '魚いる', key: 'fish' },
  { emoji: '❌', label: '全然ダメ', key: 'bad' },
  { emoji: '📍', label: '移動', key: 'move' },
]

function InfoHub({ recipes, setRecipes, notes, setNotes, feedbacks, setFeedbacks, groupLog, setGroupLog, prefs }) {
  const [section, setSection] = useState('recipe')
  const [recipeForm, setRecipeForm] = useState({
    title: '',
    fishSpecies: FISH_LIST[0],
    hook: '',
    harisu: '',
    omodori: '',
    line: '',
    layout: '',
    videoUrl: '',
    isPublic: false,
  })
  const [noteForm, setNoteForm] = useState({ fishSpecies: '', title: '', body: '', youtubeUrl: '' })
  const [fbForm, setFbForm] = useState({ type: '機能リクエスト', message: '' })

  const admin = prefs?.isAdmin

  const sortedFb = useMemo(() => [...feedbacks].sort((a, b) => (b.likes || 0) - (a.likes || 0)), [feedbacks])

  function addRecipe(e) {
    e.preventDefault()
    if (!recipeForm.title.trim()) return
    setRecipes(prev => [
      {
        id: `rcp-${Date.now()}`,
        createdAt: Date.now(),
        ...recipeForm,
      },
      ...prev,
    ])
    setRecipeForm(r => ({ ...r, title: '', hook: '', harisu: '', omodori: '', line: '', layout: '', videoUrl: '' }))
  }

  function addNote(e) {
    e.preventDefault()
    if (!noteForm.title.trim()) return
    setNotes(prev => [{ id: `note-${Date.now()}`, updatedAt: Date.now(), ...noteForm }, ...prev])
    setNoteForm({ fishSpecies: '', title: '', body: '', youtubeUrl: '' })
  }

  function addFeedback(e) {
    e.preventDefault()
    if (!fbForm.message.trim()) return
    setFeedbacks(prev => [
      {
        id: `fb-${Date.now()}`,
        createdAt: Date.now(),
        likes: 0,
        status: 'open',
        ...fbForm,
      },
      ...prev,
    ])
    setFbForm({ type: '機能リクエスト', message: '' })
  }

  function appendGroup(key) {
    setGroupLog(prev => [{ id: `g-${Date.now()}`, at: Date.now(), key, label: QUICK.find(q => q.key === key)?.label || key }, ...prev])
  }

  const dash = useMemo(() => {
    const by = {}
    groupLog.forEach(g => {
      by[g.key] = (by[g.key] || 0) + 1
    })
    return by
  }, [groupLog])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {[
          { id: 'recipe', label: '仕掛けレシピ' },
          { id: 'note', label: 'ノート' },
          { id: 'group', label: 'グループ釣況' },
          { id: 'fb', label: 'フィードバック' },
        ].map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            style={{
              padding: '8px 10px',
              borderRadius: '999px',
              border: section === s.id ? '2px solid #0F6E56' : '1px solid #ddd',
              background: section === s.id ? '#E1F5EE' : 'white',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === 'recipe' && (
        <div>
          <p style={{ fontSize: '12px', color: '#666' }}>仕掛けレシピをローカルに保存（動画URL・公開フラグ対応）。AI自動作成はフェーズ2予定。</p>
          <form onSubmit={addRecipe} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
            <input value={recipeForm.title} onChange={e => setRecipeForm({ ...recipeForm, title: e.target.value })} placeholder="レシピ名" style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <select value={recipeForm.fishSpecies} onChange={e => setRecipeForm({ ...recipeForm, fishSpecies: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
              {FISH_LIST.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
              <input value={recipeForm.hook} onChange={e => setRecipeForm({ ...recipeForm, hook: e.target.value })} placeholder="針" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input value={recipeForm.harisu} onChange={e => setRecipeForm({ ...recipeForm, harisu: e.target.value })} placeholder="ハリス" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input value={recipeForm.omodori} onChange={e => setRecipeForm({ ...recipeForm, omodori: e.target.value })} placeholder="オモリ" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input value={recipeForm.line} onChange={e => setRecipeForm({ ...recipeForm, line: e.target.value })} placeholder="ライン" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <textarea value={recipeForm.layout} onChange={e => setRecipeForm({ ...recipeForm, layout: e.target.value })} placeholder="配置・手順メモ" rows={2} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none', boxSizing: 'border-box', marginBottom: '6px' }} />
            <input value={recipeForm.videoUrl} onChange={e => setRecipeForm({ ...recipeForm, videoUrl: e.target.value })} placeholder="動画URL（任意）" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', marginBottom: '8px' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '8px' }}>
              <input type="checkbox" checked={recipeForm.isPublic} onChange={e => setRecipeForm({ ...recipeForm, isPublic: e.target.checked })} />
              公開レシピとして保存（将来の共有用フラグ）
            </label>
            <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#0F6E56', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
              レシピを保存
            </button>
          </form>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recipes.map(r => (
              <li key={r.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '10px', marginBottom: '8px', fontSize: '13px' }}>
                <strong>{r.title}</strong> · {r.fishSpecies}
                <div style={{ fontSize: '12px', color: '#666' }}>
                  針 {r.hook || '—'} / ハリス {r.harisu || '—'} / オモリ {r.omodori || '—'}
                </div>
                {r.videoUrl && (
                  <a href={r.videoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0F6E56' }}>
                    動画を開く
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setRecipes(prev => prev.filter(x => x.id !== r.id))}
                  style={{ marginLeft: '8px', fontSize: '11px', border: 'none', background: 'none', color: '#a00', cursor: 'pointer' }}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section === 'note' && (
        <div>
          <p style={{ fontSize: '12px', color: '#666' }}>魚種別ノートと「ジャンルなし」ノート。YouTube URL から再生。</p>
          <form onSubmit={addNote} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
            <select value={noteForm.fishSpecies} onChange={e => setNoteForm({ ...noteForm, fishSpecies: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="">ジャンルなし（全般メモ）</option>
              {FISH_LIST.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <input value={noteForm.title} onChange={e => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="タイトル" style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <textarea value={noteForm.body} onChange={e => setNoteForm({ ...noteForm, body: e.target.value })} placeholder="本文" rows={3} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none', boxSizing: 'border-box' }} />
            <input value={noteForm.youtubeUrl} onChange={e => setNoteForm({ ...noteForm, youtubeUrl: e.target.value })} placeholder="YouTube URL" style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#0F6E56', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
              ノートを保存
            </button>
          </form>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notes.map(n => (
              <li key={n.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '10px', marginBottom: '8px', fontSize: '13px' }}>
                <strong>{n.title}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>{n.fishSpecies || 'ジャンルなし'}</div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '12px', marginTop: '6px' }}>{n.body}</div>
                {n.youtubeUrl && (
                  <a href={n.youtubeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#0F6E56' }}>
                    YouTubeを開く
                  </a>
                )}
                <button type="button" onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))} style={{ marginLeft: '8px', fontSize: '11px', border: 'none', background: 'none', color: '#a00', cursor: 'pointer' }}>
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section === 'group' && (
        <div>
          <p style={{ fontSize: '12px', color: '#666' }}>ワンタップ通知をローカルに積み上げ（デモ）。実際のリアルタイム共有はフェーズ2でバックエンド連携。</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {QUICK.map(q => (
              <button key={q.key} type="button" onClick={() => appendGroup(q.key)} style={{ padding: '12px 8px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '13px' }}>
                {q.emoji} {q.label}
              </button>
            ))}
          </div>
          <div style={{ background: '#f4f7f5', borderRadius: '12px', padding: '10px', marginBottom: '10px', fontSize: '12px' }}>
            <strong>ダッシュボード（集計）</strong>
            <div style={{ marginTop: '6px' }}>
              {QUICK.map(q => (
                <span key={q.key} style={{ marginRight: '10px' }}>
                  {q.emoji} {dash[q.key] || 0}
                </span>
              ))}
            </div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
            {groupLog.slice(0, 40).map(g => (
              <li key={g.id} style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                {new Date(g.at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} · {g.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {section === 'fb' && (
        <div>
          <form onSubmit={addFeedback} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
            <select value={fbForm.type} onChange={e => setFbForm({ ...fbForm, type: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
              {['機能リクエスト', 'バグ報告', '改善提案'].map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <textarea value={fbForm.message} onChange={e => setFbForm({ ...fbForm, message: e.target.value })} placeholder="内容" rows={3} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#0F6E56', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
              送信（ローカル保存）
            </button>
          </form>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', marginBottom: '6px' }}>みんなの声（いいね順・ローカル）</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sortedFb.map(f => (
              <li key={f.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '10px', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ fontSize: '11px', color: '#888' }}>{f.type}</span>
                <div style={{ marginTop: '4px' }}>{f.message}</div>
                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setFeedbacks(prev => prev.map(x => (x.id === f.id ? { ...x, likes: (x.likes || 0) + 1 } : x)))} style={{ fontSize: '12px', border: '1px solid #ddd', borderRadius: '8px', padding: '4px 10px', background: 'white', cursor: 'pointer' }}>
                    👍 {f.likes || 0}
                  </button>
                  {admin && (
                    <select value={f.status} onChange={e => setFeedbacks(prev => prev.map(x => (x.id === f.id ? { ...x, status: e.target.value } : x)))} style={{ fontSize: '12px', padding: '4px', borderRadius: '6px' }}>
                      <option value="open">未対応</option>
                      <option value="doing">対応中</option>
                      <option value="done">完了</option>
                    </select>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default InfoHub
