import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, BarChart, Bar
} from 'recharts';
import { ArrowUp, ArrowDown, Users, MapPin, User } from 'lucide-react';
import RegionDistrictInsights from './RegionDistrictInsights';

const AdminAnalytics = ({ users }) => {
  // Initialize with empty data structure
  const initialAnalytics = {
    demographics: {
      ageGroups: [],
      gender: [],
      manglic: [],
      height: [] // Add height here
    },
    location: {
      states: [],
      districts: []
    },
    education: {
      levels: [],
      employment: []
    },
    physical: {
      height: [],
      complexion: [],
      bloodGroup: []
    }
  };

  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('demographics');

  // Color palette
    const colors = {
    primary: ['#ff7f0e', '#ff9d4d', '#ffb97d', '#ffd6ad'], // Shades of orange
    secondary: ['#1f77b4', '#4a90e2', '#7abaff', '#a3d4ff'], // Shades of blue
    accent: ['#2ca02c', '#4caf50', '#66bb6a', '#81c784'] // Shades of green
  };

  useEffect(() => {
    if (users && users.length > 0) {
      processData(users);
    }
    setLoading(false);
  }, [users]);

  const processData = (users) => {
    // Demographics
    const ageGroups = {
      '18-25': 0, '26-30': 0, '31-35': 0, '36-40': 0, '40+': 0
    };
    const genderCount = { Male: 0, Female: 0 };
    const manglicStatus = { Yes: 0, No: 0 };
    // Reset height distribution
    const heightDistribution = {};
    
    // Initialize the height range
    for (let feet = 3; feet <= 7; feet++) {
      for (let inches = 0; inches < 12; inches++) {
        const height = `${feet} ft and ${inches} inches`;
        heightDistribution[height] = 0; // Initialize with zero
      }
    }
  
    // Location
    const stateDistribution = {};
    const districtDistribution = {};
  
    // Education & Employment
    const educationLevels = {};
    const employmentStatus = {};
  
    // Process user data
    users.forEach(user => {
      // Age processing
      let birthDate = user.dateOfBirth;
      if (birthDate) {
        if (birthDate.toDate) {
          birthDate = birthDate.toDate();
        } else if (typeof birthDate === 'string') {
          birthDate = new Date(birthDate);
        }
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age <= 25) ageGroups['18-25']++;
        else if (age <= 30) ageGroups['26-30']++;
        else if (age <= 35) ageGroups['31-35']++;
        else if (age <= 40) ageGroups['36-40']++;
        else ageGroups['40+']++;
      }
  
      // Gender
      if (user.sex) genderCount[user.sex]++;
      
      // Manglic status
      if (user.manglic) {
        const validManglicStatus = ['Yes', 'No'];
        if (validManglicStatus.includes(user.manglic)) {
          manglicStatus[user.manglic] = (manglicStatus[user.manglic] || 0) + 1;
        }
      }
  
      // Count users for each height
      if (user.height) {
        heightDistribution[user.height] = (heightDistribution[user.height] || 0) + 1;
      }
  
      // Location
      if (user.state) {
        stateDistribution[user.state] = (stateDistribution[user.state] || 0) + 1;
      }
      if (user.district) {
        districtDistribution[user.district] = (districtDistribution[user.district] || 0) + 1;
      }
  
      // Education & Employment
      if (user.highestQualification) {
        const validQualifications = ['tenthPass', 'twelfthPass', 'graduate', 'postGraduate'];
        if (validQualifications.includes(user.highestQualification)) {
          educationLevels[user.highestQualification] = (educationLevels[user.highestQualification] || 0) + 1;
        }
      }
      if (user.employmentStatus) {
        const validEmploymentStatuses = ['unemployed', 'employed', 'student'];
        if (validEmploymentStatuses.includes(user.employmentStatus)) {
          employmentStatus[user.employmentStatus] = (employmentStatus[user.employmentStatus] || 0) + 1;
        }
      }
    });
  
    // Convert to array format and sort
    const sortedHeights = Object.entries(heightDistribution)
      .map(([height, count]) => ({
        height,
        count
      }))
      .sort((a, b) => {
        const [aFeet, aInches] = a.height.split(' ft and ').map(part => parseInt(part.replace(' inches', '')));
        const [bFeet, bInches] = b.height.split(' ft and ').map(part => parseInt(part.replace(' inches', '')));
        return (aFeet * 12 + aInches) - (bFeet * 12 + bInches);
      });

    setAnalytics({
      demographics: {
        ageGroups: Object.entries(ageGroups).map(([range, count]) => ({
          range,
          count
        })),
        gender: Object.entries(genderCount).map(([type, count]) => ({
          type,
          count
        })),
        manglic: Object.entries(manglicStatus).map(([status, count]) => ({
          status,
          count
        })),
        height: sortedHeights
      },
      location: {
        states: Object.entries(stateDistribution)
          .map(([state, count]) => ({
            state,
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        districts: Object.entries(districtDistribution)
          .map(([district, count]) => ({
            district,
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      },
      education: {
        levels: Object.entries(educationLevels).map(([level, count]) => ({
          level,
          count
        })),
        employment: Object.entries(employmentStatus).map(([status, count]) => ({
          status,
          count
        }))
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  const renderMetricCard = (title, value, icon, trend) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderDemographics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderMetricCard(
          'Total Users',
          users.length,
          <Users className="text-orange-500" size={24} />
        )}
        {renderMetricCard(
          'Total States',
          analytics.location.states.length,
          <MapPin className="text-purple-500" size={24} />
        )}
        
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.demographics.ageGroups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.demographics.gender}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.demographics.gender.map((entry, index) => (
                  <Cell key={index} fill={colors.primary[index % colors.primary.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Manglic Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.demographics.manglic}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.demographics.manglic.map((entry, index) => (
                  <Cell key={index} fill={colors.accent[index % colors.accent.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Height Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.demographics.height}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="height" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#059669" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderLocationInsights = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Top 10 States</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={analytics.location.states}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="state" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#7c3aed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
    {/* Add the new RegionDistrictInsights component here */}
    <RegionDistrictInsights users={users} />
  </div>
);

  const renderEducationEmployment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Education Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.education.levels}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.education.levels.map((entry, index) => (
                  <Cell key={index} fill={colors.secondary[index % colors.secondary.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Employment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.education.employment}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.education.employment.map((entry, index) => (
                  <Cell key={index} fill={colors.accent[index % colors.accent.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const sections = {
    demographics: {
      title: 'Demographics & Personal Details',
      content: renderDemographics
    },
    location: {
      title: 'Location Insights',
      content: renderLocationInsights
    },
    education: {
      title: 'Education & Employment',
      content: renderEducationEmployment
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Comprehensive user analytics and insights</p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {sections[activeSection].content()}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;