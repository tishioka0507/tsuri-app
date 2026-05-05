import { Fragment, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const HOKKAIDO_CENTER = [43.35, 142.36]

function fishHue(name) {
  let h = 0
  for (let i = 0; i < (name || '').length; i += 1) h = (h + name.charCodeAt(i) * 17) % 360
  return h
}

function googleNavUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

function appleMapsUrl(lat, lng) {
  return `https://maps.apple.com/?daddr=${lat},${lng}`
}

function MapView({ records, mockFriendRecords, showFriendMock }) {
  const [fishFilter, setFishFilter] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const mine = useMemo(() => {
    return records.filter(r => r.lat != null && r.lng != null && !r.isFriend)
  }, [records])

  const friends = useMemo(() => {
    if (!showFriendMock) return []
    return mockFriendRecords.filter(r => r.lat != null && r.lng != null && !r.locationPrivate)
  }, [mockFriendRecords, showFriendMock])

  const filtered = useMemo(() => {
    const list = [...mine, ...friends]
    return list.filter(r => {
      if (fishFilter && r.fish !== fishFilter) return false
      if (from && r.date < from) return false
      if (to && r.date > to) return false
      return true
    })
  }, [mine, friends, fishFilter, from, to])

  const center = filtered[0] ? [filtered[0].lat, filtered[0].lng] : HOKKAIDO_CENTER

  const fishOptions = useMemo(() => {
    const s = new Set()
    records.forEach(r => r.fish && s.add(r.fish))
    mockFriendRecords.forEach(r => r.fish && s.add(r.fish))
    return [...s].sort()
  }, [records, mockFriendRecords])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px', lineHeight: 1.5 }}>
        オンライン時は OpenStreetMap を表示（Google Maps API キーなしで利用可能）。ピンは記録フォームで取得した緯度経度がある場合のみ表示されます。
      </p>

      <div style={{ display: 'grid', gap: '8px', marginBottom: '10px' }}>
        <select value={fishFilter} onChange={e => setFishFilter(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }}>
          <option value="">魚種（すべて）</option>
          {fishOptions.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
          <input type="date" value={to} onChange={e => setTo(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} />
        </div>
      </div>

      <div style={{ height: '320px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
        <MapContainer center={center} zoom={filtered.length ? 8 : 6.5} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filtered.map(r => {
            const isFriend = !!r.isFriend
            const count = Number(r.count) || 1
            const radius = Math.min(14, 6 + Math.log2(count + 1) * 4)
            const color = `hsl(${fishHue(r.fish)}, ${isFriend ? '55%' : '70%'}, ${isFriend ? '45%' : '35%'})`
            const hasSpot = r.lat != null && r.lng != null
            const hasPark = r.parkingLat != null && r.parkingLng != null && !isFriend

            return (
              <Fragment key={r.id}>
                {hasSpot && (
                  <CircleMarker center={[r.lat, r.lng]} pathOptions={{ color, fillColor: color, fillOpacity: 0.35 }} radius={radius}>
                    <Popup>
                      <div style={{ minWidth: '160px', fontSize: '12px' }}>
                        <strong>
                          {r.fish}
                          {isFriend && `（${r.friendName || '友達'}）`}
                        </strong>
                        <div>{r.date}</div>
                        <div>{r.location || '—'}</div>
                        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <a href={googleNavUrl(r.lat, r.lng)} target="_blank" rel="noreferrer">
                            Googleマップでナビ
                          </a>
                          <a href={appleMapsUrl(r.lat, r.lng)} target="_blank" rel="noreferrer">
                            Appleマップでナビ
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                )}
                {hasPark && (
                  <Marker position={[r.parkingLat, r.parkingLng]}>
                    <Popup>
                      <div style={{ fontSize: '12px' }}>
                        🅿️ 駐車（{r.fish}）
                        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <a href={googleNavUrl(r.parkingLat, r.parkingLng)} target="_blank" rel="noreferrer">
                            Googleマップでナビ
                          </a>
                          <a href={appleMapsUrl(r.parkingLat, r.parkingLng)} target="_blank" rel="noreferrer">
                            Appleマップでナビ
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </Fragment>
            )
          })}
        </MapContainer>
      </div>

      <p style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>
        オフラインマップの完全ダウンロードは PWA + 別途タイルキャッシュが必要です（本番では専用オフライン層を検討）。
      </p>
    </div>
  )
}

export default MapView
