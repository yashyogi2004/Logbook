import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart2 } from 'lucide-react';

const StatsChart = ({ logs }) => {
  // 1. Logs Data ko Process karo (Count Status)
  const statusCounts = {
    Completed: 0,
    Pending: 0,
    inComplete: 0
  };

  logs.forEach(log => {
    if (statusCounts[log.status] !== undefined) {
      statusCounts[log.status]++;
    } else {
      // Fallback for any other status
      statusCounts['Pending']++; 
    }
  });

  // 2. Data format for Recharts
  const data = [
    { name: 'Completed', value: statusCounts.Completed, color: '#10B981' }, // Green
    { name: 'Pending', value: statusCounts.Pending, color: '#F59E0B' },   // Yellow
    { name: 'Failed', value: statusCounts.inComplete, color: '#EF4444' }, // Red
  ];

  // Agar koi log nahi hai toh Empty State dikhao
  if (logs.length === 0) {
    return (
      <div className="p-6 h-full flex flex-col justify-center items-center text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-3">
          <BarChart2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-500 font-medium">No Data Available</h3>
        <p className="text-xs text-gray-400 mt-1">Create logs to see your stats!</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-[#212529] flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#00B8D9]" />
          Log Statistics
        </h3>
      </div>

      <div className="flex-grow flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text (Total Logs) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
          <span className="block text-3xl font-extrabold text-gray-800">{logs.length}</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total</span>
        </div>
      </div>
    </div>
  );
};

export default StatsChart;