import {React,useState} from 'react'
import { LogOut, Users, User,ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const createLog = ({Logout}) => {
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        attachment:"",
        status:""
    });
   
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const res=await fetch(`${import.meta.env.VITE_URL}/log/create`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials:"include",
                body:JSON.stringify(formData)
            });
            if(res.ok){
                navigate("/dashboard");
            }
        } catch (err) {
            console.log(err);
        }
    }
  
  return (
    <div>
           <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
          <div className="flex justify-between items-center py-4">
             <div className='p-2 cursor-pointer flex items-center gap-2 bg-smoke-white border border-gray-200 rounded-md' onClick={()=>{navigate(-1)}}>
            <ArrowLeft className="h-4 w-4" />
            <span className='  text-gray-900'>Back</span>
          </div>
            {/* <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div> */}
            <button
              onClick={() => { Logout() }}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Create New Log</h2>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={(e)=>{ handleSubmit(e);}}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Enter log title"
                required
                onChange={(e)=>{handleChange(e)}}
                name='title'
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                placeholder="Enter log description"
                required
                onChange={(e)=>{handleChange(e)}}
                name='description'
                rows="4"
            ></textarea>
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attachment">
                Attachment URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="attachment"
                type="text" 
                placeholder="Enter attachment URL (optional)"
                onChange={(e)=>{handleChange(e)}}
                name='attachment'
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                required
                onChange={(e)=>{handleChange(e)}}
                name='status'
                defaultValue="Pending"
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="inComplete">Failed</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
            >
                Create Log
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default createLog