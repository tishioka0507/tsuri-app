/** Open-Meteo（無料・キー不要） */

const DEFAULT_LAT = 43.0618
const DEFAULT_LNG = 141.3544

export async function fetchWeatherArchive({ latitude = DEFAULT_LAT, longitude = DEFAULT_LNG, date }) {
  const url = new URL('https://archive-api.open-meteo.com/v1/archive')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('start_date', date)
  url.searchParams.set('end_date', date)
  url.searchParams.set('hourly', 'temperature_2m,weathercode,windspeed_10m,winddirection_10m')
  url.searchParams.set('timezone', 'Asia/Tokyo')
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('archive failed')
  return res.json()
}

export async function fetchMarineArchive({ latitude = DEFAULT_LAT, longitude = DEFAULT_LNG, date }) {
  const url = new URL('https://marine-api.open-meteo.com/v1/marine')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('start_date', date)
  url.searchParams.set('end_date', date)
  url.searchParams.set('hourly', 'wave_height,sea_surface_temperature')
  url.searchParams.set('timezone', 'Asia/Tokyo')
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('marine archive failed')
  return res.json()
}

export async function fetchForecastWeek({ latitude = DEFAULT_LAT, longitude = DEFAULT_LNG }) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', 'weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max')
  url.searchParams.set('forecast_days', '7')
  url.searchParams.set('timezone', 'Asia/Tokyo')
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('forecast failed')
  return res.json()
}

export async function fetchMarineForecastWeek({ latitude = DEFAULT_LAT, longitude = DEFAULT_LNG }) {
  const url = new URL('https://marine-api.open-meteo.com/v1/marine')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('daily', 'wave_height_max,wave_direction_dominant')
  url.searchParams.set('forecast_days', '7')
  url.searchParams.set('timezone', 'Asia/Tokyo')
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('marine forecast failed')
  return res.json()
}

/** WMO weathercode → 日本語ざっくり */
export function weatherCodeLabel(code) {
  const c = Number(code)
  if (c === 0) return '快晴'
  if (c <= 3) return '晴れ〜薄曇り'
  if (c <= 48) return '霧・霞'
  if (c <= 57) return '霧雨'
  if (c <= 67) return '雨'
  if (c <= 77) return '雪'
  if (c <= 82) return 'にわか雨'
  if (c <= 86) return '雪'
  if (c <= 99) return '雷雨'
  return '—'
}

export function windDirFromDeg(deg) {
  const d = ((deg % 360) + 360) % 360
  const dirs = ['北', '北東', '東', '南東', '南', '南西', '西', '北西']
  return dirs[Math.round(d / 45) % 8]
}
