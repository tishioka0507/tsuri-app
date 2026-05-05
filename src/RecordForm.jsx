import { useState } from 'react'
import {
  FISH_LIST,
  SPOT_PRESETS,
  WEATHER_LIST,
  TIDE_LIST,
  SWELL_LIST,
  WIND_DIR_LIST,
  TACKLE_LIST,
  RETRIEVE_LIST,
  ACTION_LIST,
  RANGE_LIST,
  SIZE_UNIT_LIST,
  WEIGHT_UNIT_LIST,
  COUNT_UNIT_LIST,
} from './constants'
import { fetchWeatherArchive, fetchMarineArchive, weatherCodeLabel, windDirFromDeg } from './lib/weatherApi'

const DEFAULT_LAT = 43.0618
const DEFAULT_LNG = 141.3544

function emptyRecord() {
  return {
    fish: '',
    customFish: '',
    length: '',
    lengthUnit: 'cm',
    weight: '',
    weightUnit: 'g',
    count: '',
    countUnit: '匹',
    time: '',
    tackle: '',
    rod: '',
    reel: '',
    line: '',
    leader: '',
    hook: '',
    lure: '',
    weather: '',
    temp: '',
    windDir: '',
    windSpeed: '',
    wave: '',
    swell: '',
    tide: '',
    seaTemp: '',
    location: '',
    locationPrivate: true,
    lat: '',
    lng: '',
    parkingLat: '',
    parkingLng: '',
    parkingNote: '',
    entryMethod: '',
    entryPhoto: '',
    episode: '',
    reflection: '',
    buyList: '',
    notes: '',
    isPublic: false,
    retrieveSpeed: '',
    lureAction: '',
    depthRange: '',
    hitPattern: '',
    companionsText: '',
    heardFromFriends: '',
    nearbyAnglers: '',
    photos: [],
    pointLabel: '',
    selectedTripId: '',
    weatherFetchedNote: '',
  }
}

function recordToFormState(r) {
  if (!r) return null
  const fishKnown = FISH_LIST.includes(r.fish)
  return {
    fish: fishKnown ? r.fish : r.fish ? 'その他' : '',
    customFish: fishKnown ? '' : r.fish || '',
    length: r.length ?? '',
    lengthUnit: r.lengthUnit || 'cm',
    weight: r.weight ?? '',
    weightUnit: r.weightUnit || 'g',
    count: r.count ?? '',
    countUnit: r.countUnit || '匹',
    time: r.time ?? '',
    tackle: r.tackle ?? '',
    rod: r.rod ?? '',
    reel: r.reel ?? '',
    line: r.line ?? '',
    leader: r.leader ?? '',
    hook: r.hook ?? '',
    lure: r.lure ?? '',
    weather: r.weather ?? '',
    temp: r.temp ?? '',
    windDir: r.windDir ?? '',
    windSpeed: r.windSpeed ?? '',
    wave: r.wave ?? '',
    swell: r.swell ?? '',
    tide: r.tide ?? '',
    seaTemp: r.seaTemp ?? '',
    location: r.location ?? '',
    locationPrivate: r.locationPrivate !== false,
    lat: r.lat != null ? String(r.lat) : '',
    lng: r.lng != null ? String(r.lng) : '',
    parkingLat: r.parkingLat != null ? String(r.parkingLat) : '',
    parkingLng: r.parkingLng != null ? String(r.parkingLng) : '',
    parkingNote: r.parkingNote ?? '',
    entryMethod: r.entryMethod ?? '',
    entryPhoto: r.entryPhoto ?? '',
    episode: r.episode ?? '',
    reflection: r.reflection ?? '',
    buyList: r.buyList ?? '',
    notes: r.notes ?? '',
    isPublic: !!r.isPublic,
    retrieveSpeed: r.retrieveSpeed ?? '',
    lureAction: r.lureAction ?? '',
    depthRange: r.depthRange ?? '',
    hitPattern: r.hitPattern ?? '',
    companionsText: r.companionsText ?? '',
    heardFromFriends: r.heardFromFriends ?? '',
    nearbyAnglers: r.nearbyAnglers ?? '',
    photos: Array.isArray(r.photos) ? r.photos : [],
    pointLabel: r.pointLabel ?? '',
    selectedTripId: r.tripId || '',
    weatherFetchedNote: '',
  }
}

function buildInitialForm(initialRecord) {
  return initialRecord ? recordToFormState(initialRecord) : { ...emptyRecord(), selectedTripId: '' }
}

function RecordForm({ date, tripOptions, initialRecord, tackleSets, onSave, onCancel }) {
  const [form, setForm] = useState(() => buildInitialForm(initialRecord))
  const [lightbox, setLightbox] = useState(null)
  const [presetId, setPresetId] = useState('')
  const [weatherLoading, setWeatherLoading] = useState(false)

  function patch(p) {
    setForm(prev => ({ ...prev, ...p }))
  }

  function applyPreset(id) {
    setPresetId(id)
    const s = tackleSets.find(x => x.id === id)
    if (!s) return
    patch({
      rod: s.rod || form.rod,
      reel: s.reel || form.reel,
      line: s.line || form.line,
      leader: s.leader || form.leader,
      hook: s.hook || form.hook,
      lure: s.lure || form.lure,
    })
  }

  function geoSpot() {
    if (!navigator.geolocation) {
      alert('位置情報を利用できません')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        patch({ lat: String(pos.coords.latitude.toFixed(5)), lng: String(pos.coords.longitude.toFixed(5)) })
      },
      () => alert('取得に失敗しました'),
      { enableHighAccuracy: true, timeout: 15000 },
    )
  }

  function geoPark() {
    if (!navigator.geolocation) {
      alert('位置情報を利用できません')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        patch({
          parkingLat: String(pos.coords.latitude.toFixed(5)),
          parkingLng: String(pos.coords.longitude.toFixed(5)),
        })
      },
      () => alert('取得に失敗しました'),
      { enableHighAccuracy: true, timeout: 15000 },
    )
  }

  async function fillWeatherFromArchive() {
    const la = Number(form.lat) || DEFAULT_LAT
    const lo = Number(form.lng) || DEFAULT_LNG
    setWeatherLoading(true)
    try {
      const [w, m] = await Promise.all([
        fetchWeatherArchive({ latitude: la, longitude: lo, date }),
        fetchMarineArchive({ latitude: la, longitude: lo, date }),
      ])
      const hi = w.hourly?.time?.findIndex(t => t.includes('12:00')) ?? 12
      const idx = hi >= 0 ? hi : 0
      const code = w.hourly?.weathercode?.[idx]
      const temp = w.hourly?.temperature_2m?.[idx]
      const ws = w.hourly?.windspeed_10m?.[idx]
      const wd = w.hourly?.winddirection_10m?.[idx]
      const wh = m.hourly?.wave_height?.[idx]
      const st = m.hourly?.sea_surface_temperature?.[idx]
      patch({
        weather: code != null ? weatherCodeLabel(code) : form.weather,
        temp: temp != null ? String(Math.round(temp * 10) / 10) : form.temp,
        windSpeed: ws != null ? String(Math.round(ws * 10) / 10) : form.windSpeed,
        windDir: wd != null ? windDirFromDeg(wd) : form.windDir,
        wave: wh != null ? String(Math.round(wh * 100) / 100) : form.wave,
        seaTemp: st != null ? String(Math.round(st * 10) / 10) : form.seaTemp,
        weatherFetchedNote: `Open-Meteo アーカイブ（${w.hourly?.time?.[idx] || date} 付近）を反映しました`,
      })
    } catch (e) {
      alert(`取得に失敗: ${e.message || e}`)
    } finally {
      setWeatherLoading(false)
    }
  }

  function onPhotos(e) {
    const files = [...e.target.files]
    e.target.value = ''
    for (const file of files.slice(0, 4)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 900_000) {
        alert(`${file.name} は大きすぎるためスキップしました（900KB以下推奨）`)
        continue
      }
      const reader = new FileReader()
      reader.onload = () => {
        setForm(prev => ({ ...prev, photos: [...prev.photos, reader.result].slice(0, 6) }))
      }
      reader.readAsDataURL(file)
    }
  }

  function onEntryPhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => patch({ entryPhoto: reader.result })
    reader.readAsDataURL(file)
  }

  function handleSave() {
    const fishName = form.fish === 'その他' ? form.customFish : form.fish
    if (!fishName) {
      alert('魚の種類を選択してください')
      return
    }
    const tripId = initialRecord?.tripId || form.selectedTripId || `trip-${Date.now()}`
    const record = {
      id: initialRecord?.id || Date.now().toString(),
      tripId,
      date,
      fish: fishName,
      length: form.length,
      lengthUnit: form.lengthUnit,
      weight: form.weight,
      weightUnit: form.weightUnit,
      count: form.count,
      countUnit: form.countUnit,
      time: form.time,
      tackle: form.tackle,
      rod: form.rod,
      reel: form.reel,
      line: form.line,
      leader: form.leader,
      hook: form.hook,
      lure: form.lure,
      weather: form.weather,
      temp: form.temp,
      windDir: form.windDir,
      windSpeed: form.windSpeed,
      wave: form.wave,
      swell: form.swell,
      tide: form.tide,
      seaTemp: form.seaTemp,
      location: form.location,
      locationPrivate: form.locationPrivate,
      lat: form.lat === '' ? undefined : Number(form.lat),
      lng: form.lng === '' ? undefined : Number(form.lng),
      parkingLat: form.parkingLat === '' ? undefined : Number(form.parkingLat),
      parkingLng: form.parkingLng === '' ? undefined : Number(form.parkingLng),
      parkingNote: form.parkingNote,
      entryMethod: form.entryMethod,
      entryPhoto: form.entryPhoto || undefined,
      episode: form.episode,
      reflection: form.reflection,
      buyList: form.buyList,
      notes: form.notes,
      isPublic: form.isPublic,
      retrieveSpeed: form.retrieveSpeed,
      lureAction: form.lureAction,
      depthRange: form.depthRange,
      hitPattern: form.hitPattern,
      companionsText: form.companionsText,
      heardFromFriends: form.heardFromFriends,
      nearbyAnglers: form.nearbyAnglers,
      photos: form.photos,
      pointLabel: form.pointLabel,
      locationEncryptedLocalOnly: form.locationPrivate,
    }
    onSave(record, { isNewTrip: !initialRecord && !form.selectedTripId })
  }

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

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#f0f0f0', zIndex: 100, overflowY: 'auto', maxWidth: '390px', margin: '0 auto' }}>
      {lightbox && (
        <button
          type="button"
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            border: 'none',
            padding: '20px',
            background: 'rgba(0,0,0,0.92)',
            cursor: 'pointer',
          }}
        >
          <img src={lightbox} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </button>
      )}

      <div style={{ padding: '14px 16px', backgroundColor: 'white', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 10 }}>
        <button type="button" onClick={onCancel} style={{ border: 'none', background: 'none', color: '#0F6E56', fontSize: '14px', cursor: 'pointer', padding: 0 }}>
          ← 戻る
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{date} の釣行記録</span>
      </div>

      <div style={{ padding: '12px' }}>
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🧭 釣行・ポイント</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>この記録を紐づける釣行</label>
            <select value={form.selectedTripId} onChange={e => patch({ selectedTripId: e.target.value })} style={inputStyle}>
              <option value="">＋ 新しい釣行として保存</option>
              {(tripOptions || []).map(t => (
                <option key={t.id} value={t.id}>
                  {t.title || t.id.slice(-8)}（同一日）
                </option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>ポイント名（任意）</label>
            <input type="text" value={form.pointLabel} onChange={e => patch({ pointLabel: e.target.value })} placeholder="例: 河口左岸" style={inputStyle} />
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🐟 釣れた魚</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>魚の種類 *</label>
            <select value={form.fish} onChange={e => patch({ fish: e.target.value })} style={inputStyle}>
              <option value="">選択してください</option>
              {FISH_LIST.map(f => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          {form.fish === 'その他' && (
            <div style={fieldStyle}>
              <label style={labelStyle}>魚名を入力</label>
              <input type="text" value={form.customFish} onChange={e => patch({ customFish: e.target.value })} placeholder="魚の名前" style={inputStyle} />
            </div>
          )}
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>サイズ</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={form.length} onChange={e => patch({ length: e.target.value })} placeholder="45" style={{ ...inputStyle, flex: 1 }} />
                <select value={form.lengthUnit} onChange={e => patch({ lengthUnit: e.target.value })} style={{ ...inputStyle, width: '60px', padding: '8px 4px' }}>
                  {SIZE_UNIT_LIST.map(u => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>重さ</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input type="number" value={form.weight} onChange={e => patch({ weight: e.target.value })} placeholder="800" style={{ ...inputStyle, flex: 1 }} />
                <select value={form.weightUnit} onChange={e => patch({ weightUnit: e.target.value })} style={{ ...inputStyle, width: '60px', padding: '8px 4px' }}>
                  {WEIGHT_UNIT_LIST.map(u => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label style={labelStyle}>数量</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input type="number" value={form.count} onChange={e => patch({ count: e.target.value })} placeholder="3" style={{ ...inputStyle, flex: 1 }} />
              <select value={form.countUnit} onChange={e => patch({ countUnit: e.target.value })} style={{ ...inputStyle, width: '70px', padding: '8px 4px' }}>
                {COUNT_UNIT_LIST.map(u => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📍 日時・場所・GPS</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>時間</label>
            <input type="time" value={form.time} onChange={e => patch({ time: e.target.value })} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>釣り場名（候補＋自由入力）</label>
            <input list="spot-presets" type="text" value={form.location} onChange={e => patch({ location: e.target.value })} placeholder="例: 石狩川河口" style={inputStyle} />
            <datalist id="spot-presets">
              {SPOT_PRESETS.map(s => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>緯度</label>
              <input value={form.lat} onChange={e => patch({ lat: e.target.value })} placeholder="43.06..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>経度</label>
              <input value={form.lng} onChange={e => patch({ lng: e.target.value })} placeholder="141.35..." style={inputStyle} />
            </div>
          </div>
          <button type="button" onClick={geoSpot} style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '10px', border: '1px solid #0F6E56', background: '#E1F5EE', color: '#0F6E56', fontWeight: 600, cursor: 'pointer' }}>
            📍 現在地を釣り場にセット
          </button>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>駐車 緯度</label>
              <input value={form.parkingLat} onChange={e => patch({ parkingLat: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>駐車 経度</label>
              <input value={form.parkingLng} onChange={e => patch({ parkingLng: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <button type="button" onClick={geoPark} style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '10px', border: '1px solid #1565c0', background: '#e3f2fd', color: '#1565c0', fontWeight: 600, cursor: 'pointer' }}>
            🅿️ 現在地を駐車場にセット
          </button>
          <div style={fieldStyle}>
            <label style={labelStyle}>駐車メモ</label>
            <input value={form.parkingNote} onChange={e => patch({ parkingNote: e.target.value })} placeholder="砂利駐車場・500円 など" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>エントリー方法・注意</label>
            <textarea value={form.entryMethod} onChange={e => patch({ entryMethod: e.target.value })} placeholder="堤防下の階段〜滑りやすい など" rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>エントリー写真</label>
            <input type="file" accept="image/*" onChange={onEntryPhoto} style={{ fontSize: '13px' }} />
            {form.entryPhoto && <img src={form.entryPhoto} alt="" onClick={() => setLightbox(form.entryPhoto)} style={{ marginTop: '8px', maxHeight: '100px', borderRadius: '8px', cursor: 'zoom-in' }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '10px 12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>📍 場所を非公開にする</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>ONにすると他のユーザーに場所は見えません</div>
            </div>
            <input type="checkbox" checked={form.locationPrivate} onChange={e => patch({ locationPrivate: e.target.checked })} style={{ width: '18px', height: '18px' }} />
          </div>
          {form.locationPrivate && (
            <div style={{ fontSize: '11px', color: '#085041', backgroundColor: '#E1F5EE', borderRadius: '8px', padding: '8px 10px', marginTop: '8px' }}>
              🔒 この釣り場の位置情報はこの端末のローカルにのみ保存され、クラウド同期前は外部に送信されません。公開サービス連携時は暗号化保存を前提にします。
            </div>
          )}
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🌤 釣れた時の状況</div>
          <button type="button" disabled={weatherLoading} onClick={fillWeatherFromArchive} style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '10px', border: 'none', background: '#1565c0', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
            {weatherLoading ? '取得中…' : '🛰 この日・緯度経度から気象・波を自動取得'}
          </button>
          {form.weatherFetchedNote && <div style={{ fontSize: '11px', color: '#1565c0', marginBottom: '8px' }}>{form.weatherFetchedNote}</div>}
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>天気</label>
              <select value={form.weather} onChange={e => patch({ weather: e.target.value })} style={inputStyle}>
                <option value="">—</option>
                {WEATHER_LIST.map(w => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>気温 (°C)</label>
              <input type="number" value={form.temp} onChange={e => patch({ temp: e.target.value })} placeholder="18" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>風向き</label>
              <select value={form.windDir} onChange={e => patch({ windDir: e.target.value })} style={inputStyle}>
                <option value="">—</option>
                {WIND_DIR_LIST.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>風速 (m/s)</label>
              <input type="number" value={form.windSpeed} onChange={e => patch({ windSpeed: e.target.value })} placeholder="3.5" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>波高 (m)</label>
              <input type="number" value={form.wave} onChange={e => patch({ wave: e.target.value })} placeholder="0.5" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>うねり</label>
              <select value={form.swell} onChange={e => patch({ swell: e.target.value })} style={inputStyle}>
                <option value="">—</option>
                {SWELL_LIST.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>潮</label>
              <select value={form.tide} onChange={e => patch({ tide: e.target.value })} style={inputStyle}>
                <option value="">—</option>
                {TIDE_LIST.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>海水温 (°C)</label>
              <input type="number" value={form.seaTemp} onChange={e => patch({ seaTemp: e.target.value })} placeholder="15" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🎣 タックル・仕掛け</div>
          {tackleSets?.length > 0 && (
            <div style={fieldStyle}>
              <label style={labelStyle}>デフォルトセットを反映</label>
              <select value={presetId} onChange={e => applyPreset(e.target.value)} style={inputStyle}>
                <option value="">選んで反映</option>
                {tackleSets.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div style={fieldStyle}>
            <label style={labelStyle}>釣り方</label>
            <select value={form.tackle} onChange={e => patch({ tackle: e.target.value })} style={inputStyle}>
              <option value="">—</option>
              {TACKLE_LIST.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>ロッド</label>
              <input type="text" value={form.rod} onChange={e => patch({ rod: e.target.value })} placeholder="例: ダイワ 9ft" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>リール</label>
              <input type="text" value={form.reel} onChange={e => patch({ reel: e.target.value })} placeholder="例: シマノ 3000番" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>ライン</label>
              <input type="text" value={form.line} onChange={e => patch({ line: e.target.value })} placeholder="例: PE1.5号" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>リーダー</label>
              <input type="text" value={form.leader} onChange={e => patch({ leader: e.target.value })} placeholder="例: 4号" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>針</label>
              <input type="text" value={form.hook} onChange={e => patch({ hook: e.target.value })} placeholder="例: 8号" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>ルアー・仕掛け</label>
              <input type="text" value={form.lure} onChange={e => patch({ lure: e.target.value })} placeholder="例: ミノー18g" style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>リトリーブ</label>
              <select value={form.retrieveSpeed} onChange={e => patch({ retrieveSpeed: e.target.value })} style={inputStyle}>
                <option value="">—</option>
                {RETRIEVE_LIST.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>アクション</label>
              <select value={form.lureAction} onChange={e => patch({ lureAction: e.target.value })} style={inputStyle}>
                <option value="">—</option>
                {ACTION_LIST.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>レンジ</label>
              <select value={form.depthRange} onChange={e => patch({ depthRange: e.target.value })} style={inputStyle}>
                <option value="">—</option>
                {RANGE_LIST.map(x => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>ヒットパターン</label>
              <input value={form.hitPattern} onChange={e => patch({ hitPattern: e.target.value })} placeholder="例: ボトム付近でジャーク" style={inputStyle} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>写真（複数・タップで拡大）</label>
            <input type="file" accept="image/*" multiple onChange={onPhotos} style={{ fontSize: '13px' }} />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              {form.photos.map((src, i) => (
                <button key={i} type="button" onClick={() => setLightbox(src)} style={{ border: 'none', padding: 0, background: 'none', cursor: 'zoom-in' }}>
                  <img src={src} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>👥 仲間・周辺情報</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>同行者の釣果（自由記述）</label>
            <textarea value={form.companionsText} onChange={e => patch({ companionsText: e.target.value })} placeholder="例: 太郎 サバ3匹 / 花子 メバル2" rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>仲間から聞いた情報</label>
            <textarea value={form.heardFromFriends} onChange={e => patch({ heardFromFriends: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div>
            <label style={labelStyle}>周りの釣り人の様子</label>
            <textarea value={form.nearbyAnglers} onChange={e => patch({ nearbyAnglers: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📝 思い出・振り返り</div>
          <div style={fieldStyle}>
            <label style={labelStyle}>エピソード</label>
            <textarea value={form.episode} onChange={e => patch({ episode: e.target.value })} placeholder="楽しかったこと・思い出..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>反省点</label>
            <textarea value={form.reflection} onChange={e => patch({ reflection: e.target.value })} placeholder="次回に活かしたいこと..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>追加購入リスト</label>
            <textarea value={form.buyList} onChange={e => patch({ buyList: e.target.value })} placeholder="次回買いたいもの..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div>
            <label style={labelStyle}>メモ</label>
            <textarea value={form.notes} onChange={e => patch({ notes: e.target.value })} placeholder="その他メモ..." rows={2} style={{ ...inputStyle, resize: 'none' }} />
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🔒 公開設定</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '10px 12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>この釣果を公開する</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>将来の共有機能用（現在はローカルのみ）</div>
            </div>
            <input type="checkbox" checked={form.isPublic} onChange={e => patch({ isPublic: e.target.checked })} style={{ width: '18px', height: '18px' }} />
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#888', marginBottom: '10px', lineHeight: 1.5 }}>
          ※ AIクイック記録（写真＋一言で下書き・不足をAIが質問）はフェーズ2でバックエンド連携予定。今は手入力と気象自動取得で代替しています。
        </div>

        <button type="button" onClick={handleSave} style={{ width: '100%', padding: '14px', backgroundColor: '#0F6E56', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px' }}>
          記録を保存する
        </button>
        <button type="button" onClick={onCancel} style={{ width: '100%', padding: '13px', backgroundColor: 'white', color: '#888', border: '1px solid #ddd', borderRadius: '12px', fontSize: '15px', cursor: 'pointer', marginBottom: '24px' }}>
          キャンセル
        </button>
      </div>
    </div>
  )
}

export default RecordForm
