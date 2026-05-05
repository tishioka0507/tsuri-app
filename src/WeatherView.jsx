import { useEffect, useState } from 'react'
import { fetchForecastWeek, fetchMarineForecastWeek, weatherCodeLabel } from './lib/weatherApi'

const DEFAULT_LAT = 43.0618
const DEFAULT_LNG = 141.3544

function WeatherView() {
  const [lat, setLat] = useState(String(DEFAULT_LAT))
  const [lng, setLng] = useState(String(DEFAULT_LNG))
  const [land, setLand] = useState(null)
  const [marine, setMarine] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setErr('')
      try {
        const la = Number(lat) || DEFAULT_LAT
        const lo = Number(lng) || DEFAULT_LNG
        const [l, m] = await Promise.all([fetchForecastWeek({ latitude: la, longitude: lo }), fetchMarineForecastWeek({ latitude: la, longitude: lo })])
        if (!cancelled) {
          setLand(l)
          setMarine(m)
        }
      } catch (e) {
        if (!cancelled) setErr(String(e.message || e))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [lat, lng])

  function useGeo() {
    if (!navigator.geolocation) {
      setErr('位置情報が使えません')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(String(pos.coords.latitude.toFixed(4)))
        setLng(String(pos.coords.longitude.toFixed(4)))
      },
      () => setErr('位置情報の取得に失敗しました'),
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  const days = land?.daily?.time || []
  const wcodes = land?.daily?.weathercode || []
  const tmax = land?.daily?.temperature_2m_max || []
  const tmin = land?.daily?.temperature_2m_min || []
  const wmax = land?.daily?.windspeed_10m_max || []
  const waveMax = marine?.daily?.wave_height_max || []

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, marginTop: 0 }}>
        Open-Meteo（陸上・marine）を利用。気象庁の細かい注意報は
        <a href="https://www.jma.go.jp/bosai/map.html#5/43.421/142.868/&elem=root&typhoon=all&contents=himawari" target="_blank" rel="noreferrer" style={{ color: '#0F6E56' }}>
          気象庁ホームページ
        </a>
        と併用してください。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        <input value={lat} onChange={e => setLat(e.target.value)} placeholder="緯度" style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
        <input value={lng} onChange={e => setLng(e.target.value)} placeholder="経度" style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
      </div>
      <button type="button" onClick={useGeo} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#0F6E56', color: 'white', fontWeight: 600, cursor: 'pointer', marginBottom: '12px' }}>
        現在地をセット
      </button>

      {err && <p style={{ color: '#b00020', fontSize: '13px' }}>{err}</p>}

      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', marginBottom: '6px' }}>週間（Open-Meteo 陸）</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: '#f0f4f2' }}>
              <th style={{ padding: '6px', textAlign: 'left' }}>日付</th>
              <th style={{ padding: '6px' }}>天気</th>
              <th style={{ padding: '6px' }}>最高</th>
              <th style={{ padding: '6px' }}>最低</th>
              <th style={{ padding: '6px' }}>風(max)</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr key={d} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '6px' }}>{d}</td>
                <td style={{ padding: '6px' }}>{weatherCodeLabel(wcodes[i])}</td>
                <td style={{ padding: '6px' }}>{tmax[i] != null ? `${tmax[i]}°` : '—'}</td>
                <td style={{ padding: '6px' }}>{tmin[i] != null ? `${tmin[i]}°` : '—'}</td>
                <td style={{ padding: '6px' }}>{wmax[i] != null ? `${wmax[i]}m/s` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6E56', margin: '14px 0 6px' }}>週間（Open-Meteo Marine · 波高目安）</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: '#e8f4fb' }}>
              <th style={{ padding: '6px', textAlign: 'left' }}>日付</th>
              <th style={{ padding: '6px' }}>波高max(m)</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr key={`m-${d}`} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '6px' }}>{d}</td>
                <td style={{ padding: '6px' }}>{waveMax[i] != null ? waveMax[i].toFixed(2) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '11px', color: '#888', marginTop: '12px', lineHeight: 1.5 }}>
        「複数サービス比較」: 上表は数値モデル系。実務では Windy・気象庁・沿岸波浪予報も併記するのがおすすめです（本アプリはリンク併記でフェーズ1を満たします）。
      </p>
    </div>
  )
}

export default WeatherView
