import React, { useEffect,useState} from 'react'
import { useNavigate } from 'react-router'


const dashboard = ({Logout}) => {
    const [users,setUsers]=useState([]);
    const navigate = useNavigate();
    const getData=async()=>{
        try{
            const res=await fetch(`${import.meta.env.VITE_URL}/users`,{
                method:"GET",
                headers:{"Content-Type":"application/json"},
                credentials:"include",
            });
            const data=await res.json();
            setUsers(data);
            console.log(users);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getData();
    },[]);


  const handleclick=(id)=>{
    navigate(`/user/${id}`);
  }

    
return (
    <>
    <div className='w-full min-h-screen bg-black flex flex-col gap-4'>
       <div className='flex justify-center items-center  w-full bg-white p-4  gap-5'>
        <h1 className='text-2xl '>Dashboard</h1>
        <button onClick={()=>{Logout()}} className='text-l ml-4 bg-red-300 rounded-md p-2'>Logout</button>
       </div>
       <div className='flex justify-center items-center flex-wrap w-full bg-blue'>
        {
            users.map((user)=>{
                return <div className='flex justify-center items-center bg-yellow-300 w-full p-4' key={user._id} onClick={()=>{handleclick(user._id)}}>
                    <h1 className='text-2xl'>{user.username}</h1>
                </div>
            })
        }
       </div>
    </div>
    </>
)
}

export default dashboard