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
