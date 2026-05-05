function row(label, value) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div style={{ display: 'flex', gap: '8px', fontSize: '13px', marginBottom: '6px', flexWrap: 'wrap' }}>
      <span style={{ color: '#888', minWidth: '88px' }}>{label}</span>
      <span style={{ color: '#222', flex: 1 }}>{String(value)}</span>
    </div>
  )
}

function RecordDetail({ record, onClose, onEdit, onDelete }) {
  if (!record) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 450,
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
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'white',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '17px' }}>釣行記録</h2>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer' }}>
            ×
          </button>
        </div>
        <p style={{ fontSize: '13px', color: '#666', margin: '6px 0 12px' }}>
          {record.date} {record.time && `· ${record.time}`}
        </p>

        <div style={{ background: '#fafafa', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
          {row('魚種', record.fish)}
          {row('サイズ', record.length ? `${record.length} ${record.lengthUnit || ''}` : '')}
          {row('重さ', record.weight ? `${record.weight} ${record.weightUnit || ''}` : '')}
          {row('数量', record.count ? `${record.count} ${record.countUnit || ''}` : '')}
          {row('釣り場', record.location)}
          {row('ポイント', record.pointLabel)}
          {row('釣り方', record.tackle)}
          {row('公開', record.isPublic ? '公開' : '非公開')}
          {row('場所の公開', record.locationPrivate ? '非公開（この端末のみ）' : '公開')}
        </div>

        <div style={{ background: '#fafafa', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F6E56', marginBottom: '8px' }}>状況・タックル</div>
          {row('天気', record.weather)}
          {row('気温', record.temp !== '' && record.temp != null ? `${record.temp} °C` : '')}
          {row('風', record.windDir && `${record.windDir} ${record.windSpeed ? `${record.windSpeed} m/s` : ''}`)}
          {row('波高', record.wave !== '' && record.wave != null ? `${record.wave} m` : '')}
          {row('うねり', record.swell)}
          {row('潮', record.tide)}
          {row('海水温', record.seaTemp !== '' && record.seaTemp != null ? `${record.seaTemp} °C` : '')}
          {row('ロッド', record.rod)}
          {row('リール', record.reel)}
          {row('ライン', record.line)}
          {row('リーダー', record.leader)}
          {row('針', record.hook)}
          {row('ルアー', record.lure)}
          {row('リトリーブ', record.retrieveSpeed)}
          {row('アクション', record.lureAction)}
          {row('レンジ', record.depthRange)}
          {row('ヒットパターン', record.hitPattern)}
        </div>

        {(record.companionsText || record.heardFromFriends || record.nearbyAnglers) && (
          <div style={{ background: '#fafafa', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F6E56', marginBottom: '8px' }}>仲間・周辺</div>
            {row('同行者など', record.companionsText)}
            {row('聞いた話', record.heardFromFriends)}
            {row('周りの釣り人', record.nearbyAnglers)}
          </div>
        )}

        {(record.entryMethod || record.parkingNote) && (
          <div style={{ background: '#fafafa', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F6E56', marginBottom: '8px' }}>駐車・エントリー</div>
            {row('駐車メモ', record.parkingNote)}
            {row('緯度経度（釣り）', record.lat != null && record.lng != null ? `${record.lat.toFixed(5)}, ${record.lng.toFixed(5)}` : '')}
            {row('駐車位置', record.parkingLat != null && record.parkingLng != null ? `${record.parkingLat.toFixed(5)}, ${record.parkingLng.toFixed(5)}` : '')}
            {row('エントリー', record.entryMethod)}
          </div>
        )}

        <div style={{ background: '#fafafa', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F6E56', marginBottom: '8px' }}>思い出</div>
          {row('エピソード', record.episode)}
          {row('反省', record.reflection)}
          {row('買い物', record.buyList)}
          {row('メモ', record.notes)}
        </div>

        {Array.isArray(record.photos) && record.photos.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F6E56', marginBottom: '8px' }}>写真</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {record.photos.map((src, i) => (
                <img key={i} src={src} alt="" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onEdit(record)}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#0F6E56', color: 'white', fontWeight: 700, cursor: 'pointer' }}
          >
            編集
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('この記録を削除しますか？')) onDelete(record)
            }}
            style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', color: '#a00', cursor: 'pointer' }}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecordDetail
