import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Users, User } from 'lucide-react';

const Dashboard = ({ Logout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_URL}/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (!res.ok) {
       
       setUsers([]);
       throw new Error('Failed to fetch users');
       
      }
      
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/currentuser`, {  
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleClick = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <div className='flex items-center bg-gradient-to-br from-blue-500 via-blue-600 p-4 rounded-b-full text-2xl [h-100][w-100] text-amber-50' onClick={() => { navigate('/profile') }}>{profile ? profile.username.charAt(0).toUpperCase() : "Guest"}</div>
            </div>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Users</h2>
          <p className="text-gray-400">Click on any user to view their profile</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={getData}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && (
          <>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <p className="text-gray-400 text-lg">No users found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => { handleClick(user._id) }}
                    className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/25"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-500 rounded-full p-3">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {user.username}
                        </h3>
                        <p className="text-gray-400 text-sm">Click to view profile</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;