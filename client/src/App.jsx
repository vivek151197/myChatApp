import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ChatsPage from './components/ChatsPage'
import Login from './components/Login'
import './App.css'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/chat' element={<ChatsPage />} />
    </Routes>
  )
}

export default App
