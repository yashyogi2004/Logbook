import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Users, User, UserPlus, UserCheck, UserMinus } from 'lucide-react';

const Dashboard = ({ Logout }) => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingFollow, setLoadingFollow] = useState({});
  const navigate = useNavigate();

  // Combine all initial data fetching into one effect
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, followingRes, profileRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_URL}/users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(`${import.meta.env.VITE_URL}/following`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(`${import.meta.env.VITE_URL}/currentuser`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
        ]);

        // Handle token expiration
        if (usersRes.status === 401 || followingRes.status === 401 || profileRes.status === 401) {
          setError('Session expired. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!usersRes.ok || !followingRes.ok || !profileRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [usersData, followingData, profileData] = await Promise.all([
          usersRes.json(),
          followingRes.json(),
          profileRes.json(),
        ]);

        setUsers(usersData || []);
        setFollowing(followingData || []);
        setProfile(profileData);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  const handleClick = useCallback((id) => {
    navigate(`/user/${id}`);
  }, [navigate]);

  const isFollowing = useCallback((userId) => {
    return following.some(f => f._id === userId);
  }, [following]);

  const handleFollow = useCallback(async (userId) => {
    setLoadingFollow(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/follow/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!res.ok) throw new Error('Failed to follow user');

      const userData = users.find(u => u._id === userId);
      setFollowing(prev => [...prev, userData || { _id: userId }]);
    } catch (err) {
      console.error(err);
      setError('Failed to follow user');
    } finally {
      setLoadingFollow(prev => ({ ...prev, [userId]: false }));
    }
  }, [users, navigate]);

  const handleUnfollow = useCallback(async (userId) => {
    setLoadingFollow(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/unfollow/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!res.ok) throw new Error('Failed to unfollow user');

      setFollowing(prev => prev.filter(f => f._id !== userId));
    } catch (err) {
      console.error(err);
      setError('Failed to unfollow user');
    } finally {
      setLoadingFollow(prev => ({ ...prev, [userId]: false }));
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <div className='flex items-center bg-gradient-to-br from-blue-500 via-blue-600 p-4 rounded-full text-2xl text-amber-50 cursor-pointer hover:scale-105 transition-transform' onClick={() => { navigate('/profile') }}>{profile ? profile.username.charAt(0).toUpperCase() : "G"}</div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Connected People (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>Connected People</span>
              </h2>
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
                  onClick={() => window.location.reload()}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Reload Page
                </button>
              </div>
            )}

            {/* Connected People List */}
            {!loading && !error && (
              <>
                {following.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 border border-gray-700 rounded-xl">
                    <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                    <p className="text-gray-400 text-lg">No connected people yet</p>
                    <p className="text-gray-500 text-sm mt-2">Follow users from the "People to Follow" section to see them here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {following.map((user) => (
                      <div
                        key={user._id}
                        className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-xl p-5 transform transition-all duration-300 hover:bg-white/20 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => { handleClick(user._id) }}>
                          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 flex-shrink-0">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {user.username}
                            </h3>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnfollow(user._id);
                          }}
                          disabled={loadingFollow[user._id]}
                          className="flex items-center space-x-1 bg-red-600/50 hover:bg-red-600 text-red-200 px-3 py-2 rounded-lg transition-colors duration-200 flex-shrink-0 ml-2 disabled:opacity-50"
                        >
                          {loadingFollow[user._id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <UserMinus className="h-4 w-4" />
                              <span className="text-sm">Unfollow</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Section - People to Follow (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="mb-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-white mb-2 flex items-center space-x-2">
                <UserPlus className="h-6 w-6" />
                <span>People to Follow</span>
              </h2>
              <p className="text-gray-400 text-sm">Discover new connections</p>
            </div>

            {/* People to Follow List */}
            {!loading && (
              <>
                {users.length === 0 ? (
                  <div className="text-center py-8 bg-white/5 border border-gray-700 rounded-xl">
                    <Users className="mx-auto h-10 w-10 text-gray-500 mb-3" />
                    <p className="text-gray-400 text-sm">No users to follow</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-lg p-4 transform transition-all duration-300 hover:bg-white/20 hover:border-blue-500"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <div className="bg-blue-500 rounded-full p-2 flex-shrink-0">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-white truncate">
                              {user.username}
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFollow(user._id)}
                          disabled={isFollowing(user._id) || loadingFollow[user._id]}
                          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 ${
                            isFollowing(user._id)
                              ? 'bg-green-600/50 text-green-200 cursor-default'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          } disabled:opacity-50`}
                        >
                          {loadingFollow[user._id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : isFollowing(user._id) ? (
                            <>
                              <UserCheck className="h-4 w-4" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;