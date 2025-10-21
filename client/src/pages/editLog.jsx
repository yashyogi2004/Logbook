import {React,useState,useEffect} from 'react'
import { LogOut, Users, User,ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

const EditLog = ({Logout}) => {
    const navigate=useNavigate();
    const { id } = useParams();
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        attachment:"",
        status:""
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLog = async () => {
            try{
                const res = await fetch(`${import.meta.env.VITE_URL}/log/${id}`, {    
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    });
                if (!res.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await res.json();
                setFormData({
                    title: data.task_title||"",
                    description: data.task_description||"",
                    attachment: data.attachment||"",
                    status: data.status||""
                });
            }catch(err){
                console.log(err);
            }
        }
        fetchLog();
      }, [id]);
   
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const res=await fetch(`${import.meta.env.VITE_URL}/log/update/${id}`,{
                method:"post",
                headers:{"Content-Type":"application/json"},
                credentials:"include",
                body:JSON.stringify(formData)
            });
            if(res.ok){
                navigate("/dashboard");
            }
            else {
                const errorData = await res.json();
                setError(errorData.message || "Something went wrong. Please try again.");
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
       {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-7xl mx-auto mt-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={() => setError(null)}>
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                    </svg>
                </span>
            </div>
        )}

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
                value={formData.title}
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
                value={formData.description}
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
                value={formData.attachment}
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
                value={formData.status}
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
                Edit Log
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLog;