import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Posts from './Posts.jsx';
import Comments from './Comments.jsx';
import DnD from './DnD.jsx';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DnD>

      </DnD>
    </>
  )
}

export default App
