import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-richblack-700 text-3xl font-bold text-blue-500">
      Tailwind CSS is working!
    </div>
    </>
  )
}

export default App
