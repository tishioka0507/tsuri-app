function Splash() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        maxWidth: '390px',
        margin: '0 auto',
        background: 'linear-gradient(165deg, #0a4d3c 0%, #0F6E56 45%, #1a8a6e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎣</div>
      <div style={{ fontSize: '22px', fontWeight: 700 }}>釣り日誌 Hokkaido</div>
      <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px' }}>記録が、次の釣りを変える</div>
    </div>
  )
}

export default Splash
