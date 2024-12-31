import React from 'react'
import {BrowserRouter,Route,Routes}    from "react-router-dom"
import SignupPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
const App = () => {
  return (
    <div className='h-screen w-full'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignupPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/home' element={<ChatPage/>}/>

        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
