import { useEffect } from 'react'

export default function Debug() {
  useEffect(() => {
    console.log('🔍 Debug page loaded')
    console.log('Window object:', typeof window)
    console.log('React version check:', !!window)
  }, [])

  return (
    <div style={{ padding: '20px', color: 'black', backgroundColor: 'white' }}>
      <h1>Debug Page - If you see this, React is working!</h1>
      <p>Check console for errors</p>
    </div>
  )
}
