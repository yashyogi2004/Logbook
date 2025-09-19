import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, LogOut, Mail, User, Calendar, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

const Profile = ({ Logout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_URL}/users/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await res.json();
      console.log(data);
      setUser(data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Failed to load user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);
 


  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">{user ? user.username.toUpperCase() : "User"}</h1>
              </div>
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

        {/* User Profile */}
        {!loading && !error && user && (
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-white mb-4">{user.username}</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <FileText className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">
                        {user.Logs?.length || 0} {user.Logs?.length === 1 ? 'Log' : 'Logs'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <Calendar className="h-5 w-5 text-red-400" />
                      <span className="text-gray-300">Joined on {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs Section */}
            <div className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-700">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-400" />
                  <span>Activity Logs</span>
                </h3>
              </div>

              {user.Logs && user.Logs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {user.Logs.map((log, index) => (
                        <tr 
                          key={log._id} 
                          className={`hover:bg-white/5 transition-colors ${
                            index % 2 === 0 ? 'bg-gray-800/20' : 'bg-transparent'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">
                              {log.task_title || 'Untitled Task'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-300 max-w-md truncate">
                              {log.task_description || 'No description'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-300 max-w-md truncate">
                              {log.attachment || 'No reference'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-300 max-w-md truncate">
                              {log.createdAt.split('T')[0] || 'No date'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(log.status)}
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                                {log.status || 'Unknown'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-8 py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <h4 className="text-xl font-semibold text-gray-300 mb-2">No Activity Logs</h4>
                  <p className="text-gray-400">This user hasn't performed any activities yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;