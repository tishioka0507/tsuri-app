/** 北海道メイン魚種（企画書・フォームと揃える） */
export const FISH_LIST = [
  'サクラマス', 'アメマス', 'カラフトマス', 'ヒラメ', 'ソイ', 'ホッケ',
  'カレイ', 'アイナメ', 'シーバス', 'サバ', 'アジ', 'メバル',
  'マダイ', 'クロダイ', 'タチウオ', 'イカ', 'その他',
]

export const SPOT_PRESETS = [
  '石狩川河口', '厚岸', '釧路港', '知床', '野付半島', '大沼', '支笏湖', '洞爺湖',
  'その他（手入力）',
]

export const WEATHER_LIST = ['晴れ', '曇り', '雨', '雪', '強風', '霧']
export const TIDE_LIST = ['大潮', '中潮', '小潮', '長潮', '若潮', '上潮', '下潮']
export const SWELL_LIST = ['小', '中', '大', 'なし', '不明']
export const WIND_DIR_LIST = ['北', '北東', '東', '南東', '南', '南西', '西', '北西']
export const TACKLE_LIST = ['ルアー', 'フライ', 'ウキ釣り', '投げ釣り', 'サビキ', 'ジギング', 'テンヤ', 'その他']
export const RETRIEVE_LIST = ['スロー', 'ミディアム', 'ファスト', 'バリエーション', 'その他']
export const ACTION_LIST = ['ただ巻き', 'トゥイッチ', 'ジャーク', 'ストップ&ゴー', 'シャローストローク', 'フォール', 'その他']
export const RANGE_LIST = ['表層', '中層', 'ボトム', '全層', 'その他']

export const SIZE_UNIT_LIST = ['cm', 'mm', 'in']
export const WEIGHT_UNIT_LIST = ['g', 'kg', 'lb', 'oz']
export const COUNT_UNIT_LIST = ['匹', '本', '枚', '尾', '杯']

/** デモ用：友達の公開記録（カレンダー色分け用） */
export const MOCK_FRIEND_RECORDS = [
  {
    id: 'mock-f-1',
    date: '2026-04-12',
    fish: 'サクラマス',
    location: '石狩川上流',
    count: '2',
    countUnit: '本',
    time: '06:30',
    weather: '晴れ',
    tide: '大潮',
    isFriend: true,
    friendName: 'たろう',
    locationPrivate: false,
    lat: 43.15,
    lng: 141.32,
  },
  {
    id: 'mock-f-2',
    date: '2026-04-18',
    fish: 'ヒラメ',
    location: '厚岸湾',
    count: '1',
    countUnit: '枚',
    time: '09:00',
    isFriend: true,
    friendName: 'みお',
    locationPrivate: true,
    lat: 43.05,
    lng: 144.85,
  },
]
