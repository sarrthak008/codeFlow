import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import AdminDashboard from './views/Admin'
import {Toaster} from "sonner"

// components
const Editor = React.lazy(() => import('./views/Editor'))

const App = () => {
  return (
    <BrowserRouter>
    <Toaster position='top-right' theme='dark'/>
      <Routes>
        <Route path="/" element={<Editor/>} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path='/admin' element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App