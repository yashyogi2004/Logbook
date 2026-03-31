<<<<<<< HEAD
import React, { useState } from 'react';
import { 
  LogOut, ArrowLeft, Send, FileText, Upload, 
  Zap, Menu, X, PlusSquare 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Sidebar component import kiya

const API_BASE_URL = import.meta.env.VITE_URL || "http://localhost:5000";

const CreateLog = ({ Logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock user for Sidebar greeting
  const user = { name: 'Student' }; 

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
formData.append("description", description);
    formData.append("status", status);
    if (file) formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/log/create`, { 
        method: "POST", 
        credentials: "include", 
        body: formData 
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned HTML. Check backend route.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create log");

      navigate("/dashboard");
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="flex h-screen font-sans bg-[#f7f8fa] relative overflow-hidden">
      
      {/* 1. SIDEBAR - Reusable and Responsive */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        user={user} 
        Logout={Logout} 
        profileLoading={false} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md p-4 sticky top-0 z-40 border-b flex justify-between items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 rounded-xl">
                <Menu className="w-6 h-6 text-gray-600" />
            </button>
        </header>

        <div className="p-4 md:p-8 max-w-5xl mx-auto">

          {/* Form Card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#00B8D9] p-8 md:p-12 text-white relative">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-2">New Entry</h2>
                    <p className="text-blue-100 font-medium text-lg opacity-90">Document your progress for the community.</p>
                </div>
                <PlusSquare className="absolute top-0 right-0 p-4 w-48 h-48 opacity-10 transform translate-x-6 -translate-y-6" />
            </div>

            {error && (
              <div className="mx-8 mt-8 p-4 bg-red-50 text-red-700 rounded-2xl font-bold border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                    <input 
                      className="w-full py-4 px-5 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-bold" 
                      type="text" 
                      placeholder="What did you achieve?" 
                      required 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                    <select 
                      className="w-full py-4 px-5 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-bold cursor-pointer appearance-none" 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="inComplete">Incomplete</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Attachment</label>
                  <label className="group relative flex flex-col items-center justify-center w-full h-full min-h-[180px] border-2 border-gray-200 border-dashed rounded-[2rem] cursor-pointer hover:bg-[#00B8D9]/5 hover:border-[#00B8D9] transition-all bg-gray-50/50 overflow-hidden">
                    {file ? (
                      <div className="text-center p-4">
                        <FileText className="w-10 h-10 text-[#00B8D9] mx-auto mb-2" />
                        <p className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black mt-1">Click to change</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-300 mb-2 group-hover:text-[#00B8D9] transition-colors" />
                        <p className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Click to upload proof</p>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  className="w-full py-4 px-5 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-[2rem] outline-none transition-all text-gray-700 font-medium min-h-[180px] resize-none" 
                  placeholder="Explain your work in detail..." 
                  required 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#00B8D9] text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-[#00B8D9]/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? "Saving to Cloud..." : "Publish Achievement"} <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
};

export default CreateLog;
=======
import React, { useState, useEffect } from 'react';
import { LogOut, ArrowLeft, Send } from 'lucide-react';
import { useNavigate, BrowserRouter as Router } from 'react-router-dom'; 

const COLORS = {
    sidebarBlue: '#4c84ff',
    accentTeal: '#20c997',
    lightBg: '#f8f9fa',
    darkText: '#343a40',
};

const CreateLog = ({ Logout }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        attachment: "", 
        status: "Pending" 
    });
    
    const defaultLogout = () => {
        console.log("Mock Logout called. Navigating to root.");
        navigate('/');
    };
    const effectiveLogout = Logout || defaultLogout;


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
     
        try {
            console.log("Submitting log data:", formData);
            
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            const res = { ok: true }; 

            if (res.ok) {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Log submission failed:", err);
        }
    }

    return (
        <div className={`min-h-screen ${'bg-lightBg'} font-sans`}>
            <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        
                            <button 
                            className='p-2 cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-darkText border border-gray-300 rounded-lg transition-colors duration-200 shadow-sm' 
                            onClick={() => { navigate(-1) }}
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className='font-medium'>Back to Dashboard</span>
                        </button>

                        <h1 className={`text-xl font-bold ${'text-darkText'} hidden sm:block`}>Create New Log</h1>
                        
                        <button
                            onClick={effectiveLogout} 
                            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <form 
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100" 
                    onSubmit={handleSubmit}
                >
                    <h2 className={`text-2xl font-semibold ${'text-darkText'} mb-8 border-b pb-4`}>New Daily Log Entry</h2>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title / Activity Summary
                        </label>
                        <input
                            className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sidebarBlue focus:border-sidebarBlue transition duration-150"
                            id="title"
                            type="text"
                            placeholder="e.g., Finished Project Setup & Initial Commit"
                            required
                            onChange={handleChange}
                            name='title'
                            value={formData.title}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Detailed Description of Work
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sidebarBlue focus:border-sidebarBlue transition duration-150"
                            id="description"
                            placeholder="Describe what you accomplished, challenges faced, and next steps."
                            required
                            onChange={handleChange}
                            name='description'
                            rows="6"
                            value={formData.description}
                        ></textarea>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attachment">
                            Attachment/Resource Link (GitHub, Google Drive, etc.)
                        </label>
                        <input
                            className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sidebarBlue focus:border-sidebarBlue transition duration-150"
                            id="attachment"
                            type="text" 
                            placeholder="https://example.com/document-link (optional)"
                            onChange={handleChange}
                            name='attachment'
                            value={formData.attachment}
                        />
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Current Status
                        </label>
                        <select
                            className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sidebarBlue focus:border-sidebarBlue transition duration-150"
                            id="status"
                            required
                            onChange={handleChange}
                            name='status'
                            value={formData.status}
                        >
                            <option value="Pending">Pending Review (Default)</option>
                            <option value="Completed">Completed Task</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Blocked">Blocked / Need Help</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center justify-end">
                        <button
                            className={`flex items-center space-x-2 bg-accentTeal hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accentTeal/50`}
                            type="submit"
                        >
                            <Send className="w-5 h-5" />
                            <span>Submit Log Entry</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const AppWrapper = () => (
    <Router>
        <CreateLog />
    </Router>
);

export default AppWrapper;
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
