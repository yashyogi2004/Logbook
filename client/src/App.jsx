import React from 'react'
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router'
import Protectedroutes from './components/protectedroutes'
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';

const App = () => {
  const handleClick=async(e)=>{
    const res=await fetch("http://localhost:5000/api/v1/logout",{
        method:"GET",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
    }) ;
    if(res.ok){
        window.location.href="/";
    }

  }
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/dashboard' element={<Protectedroutes><Dashboard Logout={handleClick}/></Protectedroutes>}></Route>
        <Route path='/user/:id' element={<Protectedroutes><Profile Logout={handleClick}/></Protectedroutes>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App