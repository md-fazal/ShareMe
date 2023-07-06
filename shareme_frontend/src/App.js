import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router'
import Home from './components/containers/Home'
import Login from './components/Login'
import { fetchUser } from './utils/fetchUser'

const App = () => {

  const navigate = useNavigate();

  useEffect(() => {
  const user = fetchUser();
  if(!user)
    navigate('/login')
  }, [])
  

  return (
    <Routes>
        <Route path='login' element={<Login/>}/>
        <Route path='/*' element={<Home/>}/>
    </Routes>
  )
}

export default App