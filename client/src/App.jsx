import {React, useEffect, useState} from 'react'
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router'
import Protectedroutes from './components/protectedroutes'
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import User from './pages/user';
import CreateLog from './pages/createLog';
import Profile from './pages/profile';
import NotFound from './pages/Error';
import ForgotPassword from './pages/forget-password';
import EditLog from './pages/editLog';
const App = () => {

  const handleClick=async(e)=>{
    const res=await fetch(`${import.meta.env.VITE_URL}/logout`,{
        method:"GET",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
    }) ;
    if(res.ok){
      localStorage.removeItem("admin");
      setAdmin({
        id: "",
        username: "",
        email: ""
      });
        window.location.href="/";
    }
  }

  const [admin,setAdmin]=useState({
    id:"",
    username:"",
    email:""
  });
  console.log(admin);

  useEffect(() => {
    const storedUser = localStorage.getItem("admin");
    if (storedUser) {
      setAdmin({
        id: JSON.parse(storedUser).id,
        username: JSON.parse(storedUser).username,
        email: JSON.parse(storedUser).email
      });
    } else {
      setAdmin({
        id: "",
        username: "",
        email: ""
      });
    }
  }, []);

   
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login admin={admin} setAdmin={setAdmin} />}></Route>
        <Route path='/login' element={<Login admin={admin} setAdmin={setAdmin} />}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/dashboard' element={<Protectedroutes admin={admin} ><Dashboard Logout={handleClick}/></Protectedroutes>}></Route>
        <Route path='/user/:id' element={<Protectedroutes admin={admin} ><User Logout={handleClick} /></Protectedroutes>}></Route>
        <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/addlog' element={<Protectedroutes admin={admin} ><CreateLog Logout={handleClick}/></Protectedroutes>}></Route>
        <Route path='/profile' element={<Protectedroutes admin={admin} ><Profile Logout={handleClick} /></Protectedroutes>}></Route>
        <Route path='/editlog/:id' element={<Protectedroutes admin={admin} ><EditLog Logout={handleClick}/></Protectedroutes>}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App