import { useState } from 'react'

const FISH_LIST = [
  'サクラマス', 'アメマス', 'カラフトマス', 'ヒラメ', 'ソイ', 'ホッケ',
  'カレイ', 'アイナメ', 'シーバス', 'サバ', 'アジ', 'メバル',
  'マダイ', 'クロダイ', 'タチウオ', 'イカ', 'その他'
]
const WEATHER_LIST = ['晴れ', '曇り', '雨', '雪', '強風', '霧']
const TIDE_LIST = ['大潮', '中潮', '小潮', '長潮', '若潮', '上潮', '下潮']
const WIND_DIR_LIST = ['北', '北東', '東', '南東', '南', '南西', '西', '北西']
const TACKLE_LIST = ['ルアー', 'フライ', 'ウキ釣り', '投げ釣り', 'サビキ', 'ジギング', 'テンヤ', 'その他']
const SIZE_UNIT_LIST = ['cm', 'mm', 'in']
const WEIGHT_UNIT_LIST = ['g', 'kg', 'lb', 'oz']
const COUNT_UNIT_LIST = ['匹', '本', '枚', '尾', '杯']

function RecordForm({ date, onSave, onCancel }) {
  const [fish, setFish] = useState('')
  const [customFish, setCustomFish] = useState('')
  const [length, setLength] = useState('')
  const [lengthUnit, setLengthUnit] = useState('cm')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('g')
  const [count, setCount] = useState('')
  const [countUnit, setCountUnit] = useState('匹')
  const [time, setTime] = useState('')
  const [tackle, setTackle] = useState('')
  const [rod, setRod] = useState('')
  const [reel, setReel] = useState('')
  const [line, setLine] = useState('')
  const [leader, setLeader] = useState('')
  const [hook, setHook] = useState('')
  const [lure, setLure] = useState('')
  const [weather, setWeather] = useState('')
  const [temp, setTemp] = useState('')
  const [windDir, setWindDir] = useState('')
  const [windSpeed, setWindSpeed] = useState('')
  const [wave, setWave] = useState('')
  const [tide, setTide] = useState('')
  const [seaTemp, setSeaTemp] = useState('')
  const [location, setLocation] = useState('')
  const [locationPrivate, setLocationPrivate] = useState(true)
  const [episode, setEpisode] = useState('')
  const [reflection, setReflection] = useState('')
  const [buyList, setBuyList] = useState('')
  const [notes, setNotes] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '3px',
  }
  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  }
  const sectionStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '12px',
  }
  const sectionTitleStyle = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#0F6E56',
    marginBottom: '12px',
    paddingBottom: '6px',
    borderBottom: '1px solid #eee',
  }
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '10px',
  }
  const fieldStyle = { marginBottom: '10px' }

  function handleSave() {
    const fishName = fish === 'その他' ? customFish : fish
    if (!fishName) { alert('魚の種類を選択してください'); return }
    const record = {
      id: Date.now().toString(),
      date,
      fish: fishName,
      length, lengthUnit, weight, weightUnit, count, countUnit,
      time, tackle, rod, reel, line, leader, hook, lure,
      weather, temp, windDir, windSpeed, wave, tide, seaTemp,
      location, locationPrivate,
      episode, reflection, buyList, notes,
      isPublic,
    }
    onSave(record)
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#f0f0f0', zIndex: 100, overflowY: 'auto', maxWidth: '390px', margin: '0 auto' }}>
      
      {/* ヘッダー */}
      <div style={{ padding: '14px 16px', backgroundColor: 'white', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onCancel} style={{ border: 'none', background: 'none', color: '#0F6E56', fontSize: '14px', cursor: 'pointer', padding: 0 }}>← 戻る</button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{date} の釣行記録</span>
      </div>

      <div style={{ padding: '12px' }}>

        {/* 魚の情報 */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🐟 釣れた魚</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>魚の種類 *</label>
            <select value={fish} onChange={e => setFish(e.target.value)} style={inputStyle}>
              <option value="">選択してください</option>
              {FISH_LIST.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          {fish === 'その他' && (
            <div style={fieldStyle}>
              <label style={labelStyle}>魚名を入力</label>
              <input type="text" value={customFish} onChange={e => setCustomFish(e.target.value)} placeholder="魚の名前" style={inputStyle} />
            </div>
          )}
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>サイズ</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="45" style={{ ...inputStyle, flex: 1 }} />
                <select value={lengthUnit} onChange={e => setLengthUnit(e.target.value)} style={{ ...inputStyle, width: '60px', padding: '8px 4px' }}>
                  {SIZE_UNIT_LIST.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>重さ</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="800" style={{ ...inputStyle, flex: 1 }} />
                <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)} style={{ ...inputStyle, width: '60px', padding: '8px 4px' }}>
                  {WEIGHT_UNIT_LIST.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label style={labelStyle}>数量</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input type="number" value={count} onChange={e => setCount(e.target.value)} placeholder="3" style={{ ...inputStyle, flex: 1 }} />
              <select value={countUnit} onChange={e => setCountUnit(e.target.value)} style={{ ...inputStyle, width: '70px', padding: '8px 4px' }}>
                {COUNT_UNIT_LIST.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 日時・場所 */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📍 日時・場所</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>時間</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>釣り場名</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="例: 石狩川河口、知床半島..." style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '10px 12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>📍 場所を非公開にする</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>ONにすると他のユーザーに場所は見えません</div>
            </div>
            <input type="checkbox" checked={locationPrivate} onChange={e => setLocationPrivate(e.target.checked)} style={{ width: '18px', height: '18px' }} />
          </div>
          {locationPrivate && (
            <div style={{ fontSize: '11px', color: '#085041', backgroundColor: '#E1F5EE', borderRadius: '8px', padding: '8px 10px', marginTop: '8px' }}>
              🔒 この釣り場の位置情報は完全に暗号化して保存され、他のユーザーに知られることはありません
            </div>
          )}
        </div>

        {/* 釣れた時の状況 */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🌤 釣れた時の状況</div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>天気</label>
              <select value={weather} onChange={e => setWeather(e.target.value)} style={inputStyle}>
                <option value="">—</option>
                {WEATHER_LIST.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>気温 (°C)</label>
              <input type="number" value={temp} onChange={e => setTemp(e.target.value)} placeholder="18" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>風向き</label>
              <select value={windDir} onChange={e => setWindDir(e.target.value)} style={inputStyle}>
                <option value="">—</option>
                {WIND_DIR_LIST.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>風速 (m/s)</label>
              <input type="number" value={windSpeed} onChange={e => setWindSpeed(e.target.value)} placeholder="3.5" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>波高 (m)</label>
              <input type="number" value={wave} onChange={e => setWave(e.target.value)} placeholder="0.5" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>潮</label>
              <select value={tide} onChange={e => setTide(e.target.value)} style={inputStyle}>
                <option value="">—</option>
                {TIDE_LIST.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>海水温 (°C)</label>
            <input type="number" value={seaTemp} onChange={e => setSeaTemp(e.target.value)} placeholder="15" style={inputStyle} />
          </div>
        </div>

        {/* タックル */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🎣 タックル・仕掛け</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>釣り方</label>
            <select value={tackle} onChange={e => setTackle(e.target.value)} style={inputStyle}>
              <option value="">—</option>
              {TACKLE_LIST.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>ロッド</label>
              <input type="text" value={rod} onChange={e => setRod(e.target.value)} placeholder="例: ダイワ 9ft" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>リール</label>
              <input type="text" value={reel} onChange={e => setReel(e.target.value)} placeholder="例: シマノ 3000番" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>ライン</label>
              <input type="text" value={line} onChange={e => setLine(e.target.value)} placeholder="例: PE1.5号" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>リーダー</label>
              <input type="text" value={leader} onChange={e => setLeader(e.target.value)} placeholder="例: 4号" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>針</label>
              <input type="text" value={hook} onChange={e => setHook(e.target.value)} placeholder="例: 8号" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>ルアー・仕掛け</label>
              <input type="text" value={lure} onChange={e => setLure(e.target.value)} placeholder="例: ミノー18g" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* 思い出・振り返り */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📝 思い出・振り返り</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>エピソード</label>
            <textarea value={episode} onChange={e => setEpisode(e.target.value)} placeholder="楽しかったこと・思い出..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>反省点</label>
            <textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="次回に活かしたいこと..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>追加購入リスト</label>
            <textarea value={buyList} onChange={e => setBuyList(e.target.value)} placeholder="次回買いたいもの..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div>
            <label style={labelStyle}>メモ</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="その他メモ..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
        </div>

        {/* 公開設定 */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🔒 公開設定</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '10px 12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>この釣果を公開する</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>他のユーザーに釣果を共有</div>
            </div>
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} style={{ width: '18px', height: '18px' }} />
          </div>
        </div>

        {/* ボタン */}
        <button onClick={handleSave} style={{ width: '100%', padding: '14px', backgroundColor: '#0F6E56', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px' }}>
          記録を保存する
        </button>
        <button onClick={onCancel} style={{ width: '100%', padding: '13px', backgroundColor: 'white', color: '#888', border: '1px solid #ddd', borderRadius: '12px', fontSize: '15px', cursor: 'pointer', marginBottom: '24px' }}>
          キャンセル
        </button>
      </div>
    </div>
  )
}

export default RecordForm