export const STORAGE_KEYS = {
  records: 'tsuri_records_v1',
  trips: 'tsuri_trips_v1',
  profile: 'tsuri_profile_v1',
  tackleSets: 'tsuri_tackle_sets_v1',
  recipes: 'tsuri_recipes_v1',
  notes: 'tsuri_notes_v1',
  feedbacks: 'tsuri_feedbacks_v1',
  groupLog: 'tsuri_group_log_v1',
  prefs: 'tsuri_prefs_v1',
}

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('saveJSON failed', key, e)
  }
}
