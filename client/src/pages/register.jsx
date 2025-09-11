import React from 'react'
import { useState } from 'react'
import { Link ,useNavigate} from 'react-router'
const register = () => {
    const [error, setError] = useState("");
    const navigate=useNavigate();
    
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };
 
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await fetch(`${import.meta.env.VITE_URL}/register`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials:"include",
            body:JSON.stringify(user)
        })
        if(res.ok){
            navigate("/");
        }else{
           setError("User already exists");
        }
        }catch(err){
        if(err.response.status===400){
            setError("User already exists");
        }else{
            setError("Something went wrong");
        }
        }
    }

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-amber-50'>
        <div className='  flex justify-center p-10 items-center  flex-col gap-5 border-1 border-x-pink-300 shadow-lg bg-white rounded-md'>
        <h1 className='text-3xl font-bold '>Register</h1>
        <form onSubmit={(e) => {handleSubmit(e)}} className='flex flex-col gap-4 mt-4'>
            <input type="text" placeholder='Username' className='p-2 border-2 border-amber-500 rounded-md' name='username' onChange={(e) => handleChange(e)}/>
            <input type="email" placeholder='Email' className='p-2 border-2 border-amber-500 rounded-md' name='email' onChange={(e) => handleChange(e)}/>
            <input type="password" placeholder='Password' className='p-2 border-2 border-amber-500 rounded-md' name='password' onChange={(e) => handleChange(e)} />
            <button type='submit' className='p-2 border-2 bg-blue-400 text-white text-xl rounded-md'>Register</button>
            <div>
                <p>Already have an account?</p>
                <Link to='/' className='text-blue-500'>click here</Link>
                {error && <p className='text-red-500'>{error}</p>}
            </div>
        </form>
        </div>
    </div>
  )
}

export default register