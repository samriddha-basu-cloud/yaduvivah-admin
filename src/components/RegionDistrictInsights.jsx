import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RegionDistrictInsights = ({ users }) => {
  // Process data for regions and districts by state
  const processLocationData = (users) => {
    const stateData = {};

    users.forEach(user => {
      if (!user.state || !user.district || !user.region) return;

      if (!stateData[user.state]) {
        stateData[user.state] = {
          regions: {},
          districts: {}
        };
      }

      // Count regions
      stateData[user.state].regions[user.region] = 
        (stateData[user.state].regions[user.region] || 0) + 1;

      // Count districts
      stateData[user.state].districts[user.district] = 
        (stateData[user.state].districts[user.district] || 0) + 1;
    });

    // Convert to array format
    return Object.entries(stateData).map(([state, data]) => ({
      state,
      regions: Object.entries(data.regions)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      districts: Object.entries(data.districts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    }));
  };

  const locationData = processLocationData(users);

  const renderStateSection = (stateData) => (
    <div key={stateData.state} className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{stateData.state}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regions Chart */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-4">Regions Distribution</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData.regions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Districts Chart */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-4">Districts Distribution</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData.districts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {locationData.map(stateData => renderStateSection(stateData))}
    </div>
  );
};

export default RegionDistrictInsights;