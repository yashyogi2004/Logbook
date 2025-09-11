import {React,useState,useEffect} from 'react'
import { useNavigate, useParams } from 'react-router'

const profile = ({Logout}) => {
  const [user,setUser]=useState({
    username:"",
    email:""
  });
  const navigate=useNavigate();
  const {id}=useParams();
  console.log(id);
  const getData=async()=>{
    try{
        const res=await fetch(`${import.meta.env.VITE_URL}/users/${id}`,{
            method:"GET",
            headers:{"Content-Type":"application/json"},
            credentials:"include",
        });
        const data=await res.json();
        console.log(data);
        setUser(data);
    }
    catch(err){
        console.log(err);
    }
  }
  useEffect(()=>{
    getData();
  },[]);

  return (
    <>
    <div className="nav w-full p-3 flex justify-center items-center gap-6 bg-black text-white">
      <h1 className="text-xl">Profile Page</h1>
      <button className="ml-6 bg-red-500 p-2 rounded" onClick={()=>{Logout()}}>Logout</button>
    </div>
    <div className="w-full min-h-screen flex justify-center bg-amber-50">
      <div className="w-full bg-white rounded-md flex  shadow-lg">
        {user && <div className="w-full flex flex-col gap-4 p-2 ">
          <div className="w-full flex justify-evenly items-center gap-4 ">
            <div className="w-40 h-40 bg-blue-300 rounded-full flex justify-center items-center text-5xl font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
            </div>
          <h1 className="text-xl font-bold">Username: {user.username}</h1>
          <h1 className="text-xl font-bold">Email: {user.email}</h1>
          <button className="bg-red-500 p-2 rounded" onClick={()=>{navigate("/dashboard")}}>Go Back</button>
        </div>
        <div className="w-full flex justify-center items-center">
          
          </div>
        </div>}
        {!user && <h1 className="text-2xl font-bold">Loading...</h1>}
      </div>

    </div>
    </>
  )
}

export default profile