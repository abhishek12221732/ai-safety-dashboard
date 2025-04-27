import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AISafetyDashboard from './AISafetyDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AISafetyDashboard />
    </>
  )
}

export default App
