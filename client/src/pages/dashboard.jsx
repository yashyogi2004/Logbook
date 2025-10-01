import React, { useState, useEffect } from 'react';
import { Home, NotebookText, PlusSquare, Heart, User, LogOut, Menu, Bell, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = {
  sidebarBlue: '#8ec8feff', 
  accentTeal: '#14B8A6',
  darkText: '#010204ff',
  lightSky: '#94d6ffff',
  patternBlue: '#D1E8F2', 
};

const mainContainerStyle = {
  backgroundColor: COLORS.lightSky,
  backgroundImage: `radial-gradient(${COLORS.patternBlue} 0.5px, transparent 0.5px)`,
  backgroundSize: '15px 15px',
  fontFamily: 'Inter, sans-serif', 
};

const SidebarLink = ({ icon: Icon, title, isActive, to, onClick }) => (
  <Link
    to={to} 
    onClick={onClick}
    className={`flex items-center space-x-3 p-4 rounded-xl transition-colors duration-200 ${
      isActive ? '#9bbbffff text-sidebarBlue shadow-lg' : 'text-white hover:#9bbbffff/20'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-lg font-medium">{title}</span>
  </Link>
);

const StatusBadge = ({ status }) => {
  const statusMap = {
    approved: ['bg-green-100', 'text-green-700', 'border-green-300', 'Approved'],
    pending: ['bg-yellow-100', 'text-yellow-700', 'border-yellow-300', 'Pending'],
    rejected: ['bg-red-100', 'text-red-700', 'border-red-300', 'Rejected'],
    default: ['bg-gray-100', 'text-gray-700', 'border-gray-300', 'Draft'],
  };
  const [bg, textColor, border, label] = statusMap[status] || statusMap.default;
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${bg} ${textColor} ${border}`}>
      {label}
    </span>
  );
};

const ProgressChart = ({ data = [] }) => {
  const maxValue = Math.max(...data.map(d => d.value), 20);
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-darkText mb-6">Your Progress</h3>
      <div className="relative h-[200px] flex flex-col justify-end">
        <div className="absolute left-0 w-full text-xs text-gray-500">
          {[0, 25, 50, 75, 100].map((p, i) => (
            <div key={i} className="absolute -top-1" style={{ top: `${p}%` }}>
              {Math.round(maxValue * (1 - p/100))}
            </div>
          ))}
        </div>
        <div className="relative flex items-end justify-between ml-10 h-full border-b border-l border-gray-300 pr-2">
          <div className="absolute w-full h-full">
            {[1/4, 1/2, 3/4].map((pos, i) => (
              <hr key={i} className="absolute w-full border-gray-200" style={{ bottom: `${pos*100}%` }} />
            ))}
          </div>
          {data.map((item, index) => {
            const heightPercent = (item.value / maxValue) * 100;
            const isTeal = item.highlight || false;
            return (
              <div key={item.label} className="flex flex-col items-center justify-end w-1/8 mx-1 z-10">
                <div
                  className="w-4 md:w-6 rounded-t-lg transition-all duration-500 ease-out shadow-md"
                  style={{ height: `${heightPercent}%`, backgroundColor: isTeal ? COLORS.accentTeal : COLORS.sidebarBlue }}
                ></div>
                <span className="mt-2 text-xs text-darkText font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 text-center text-sm font-semibold text-gray-600">Logs Submitted</div>
    </div>
  );
};

const RecentLogs = ({ logs = [] }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold text-darkText mb-6">Recent Logs</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            <th className="py-2">Title</th>
            <th className="py-2 text-center hidden sm:table-cell">Date</th>
            <th className="py-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50 transition duration-150">
              <td className="py-3 text-sm font-medium text-darkText whitespace-nowrap">{log.title}</td>
              <td className="py-3 text-sm text-gray-500 text-center hidden sm:table-cell">{log.date}</td>
              <td className="py-3 text-right">
                <StatusBadge status={log.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Dashboard = ({ Logout, user, logsData, progressData }) => {
  const [activePage, setActivePage] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const defaultLogsData = [
    { id: 1, title: 'Calculus Assignment 5', date: 'Oct 1, 2025', status: 'approved' },
    { id: 2, title: 'Web Dev Project Wireframe', date: 'Sep 30, 2025', status: 'pending' },
    { id: 3, title: 'Physics Lab Report', date: 'Sep 29, 2025', status: 'rejected' },
    { id: 4, title: 'Study Notes for History', date: 'Sep 28, 2025', status: 'default' },
  ];

  const defaultProgressData = [
    { label: 'Mon', value: 8, highlight: false },
    { label: 'Tue', value: 12, highlight: false },
    { label: 'Wed', value: 15, highlight: true },
    { label: 'Thu', value: 10, highlight: false },
    { label: 'Fri', value: 18, highlight: false },
    { label: 'Sat', value: 20, highlight: false },
    { label: 'Sun', value: 14, highlight: false },
  ];

  const finalLogsData = logsData || defaultLogsData;
  const finalProgressData = progressData || defaultProgressData;

  const navItems = [
    { title: 'Dashboard', icon: Dashboard, page: 'Dashboard', path: '/dashboard' },
    { title: 'Logs', icon: NotebookText, page: 'Logs', path: '/logs' },
    { title: 'Add New', icon: PlusSquare, page: 'createLog', path: '/createLog' },
    { title: 'Archive', icon: Heart, page: 'Archive', path: '/archive' }, 
    { title: 'Profile', icon: User, page: 'Profile', path: '/user' },
  ];

  useEffect(() => {
    const currentPath = window.location.pathname;
    const activeItem = navItems.find(item => currentPath.startsWith(item.path));
    setActivePage(activeItem?.page || 'Home');
  }, []);

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex h-screen font-sans" style={mainContainerStyle}>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-sidebarBlue shadow-2xl p-6 flex flex-col transition-transform duration-300 z-50 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-2xl font-extrabold text-white mb-4 border-b border-white/20 pb-4">
          College Logbook
          <div className="font-light text-sm opacity-80 mt-1">{user?.name || 'User Name'}</div>
        </div>
        <nav className="space-y-3 flex-grow">
          {navItems.map(item => (
            <SidebarLink key={item.page} icon={item.icon} title={item.title} to={item.path} isActive={activePage === item.page} onClick={() => handleNavClick(item.page)} />
          ))}
        </nav>
        <button onClick={Logout} className="flex items-center space-x-3 p-4 rounded-xl text-white hover:bg-white/20 transition-colors duration-200 mt-6">
          <LogOut className="w-5 h-5" />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </aside>

      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-40 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-12 bg-white p-4 rounded-2xl shadow-xl sticky top-4 z-30">
          <button className="md:hidden text-darkText p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-darkText hidden md:block">{activePage === 'Home' ? 'Dashboard Overview' : activePage}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-base font-semibold text-gray-500 hidden sm:block">{today}</span>
            <Bell className="w-5 h-5 text-gray-500 hover:text-darkText cursor-pointer transition-colors" />
            <div className="w-9 h-9 rounded-full bg-sidebarBlue flex items-center justify-center cursor-pointer shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-3xl font-extrabold text-darkText mb-6">Ready to log your progress?</h2>
            <Link to="/createLog" className="inline-flex items-center space-x-2 px-8 py-4  bg-8ec8feff text-white font-bold text-lg rounded-xl hover:bg-8ec8feff/90 transition duration-300 shadow-xl hover:shadow-2xl hover:translate-y-0.5">
              <PlusSquare className="w-6 h-6" />
              <span>Add New Log</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 h-full transform transition-shadow hover:shadow-3xl">
              <ProgressChart data={finalProgressData} />
            </div>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 h-full transform transition-shadow hover:shadow-3xl">
              <RecentLogs logs={finalLogsData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
