import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { ArrowUp, ArrowDown, Users, MapPin, User } from 'lucide-react';

const AdminAnalytics = ({ users }) => {
  // Initialize with empty data structure
  const initialAnalytics = {
    demographics: {
      ageGroups: [],
      gender: [],
      manglic: []
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
    primary: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
    secondary: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'],
    accent: ['#059669', '#10b981', '#34d399', '#6ee7b7']
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
    // if (user.manglic !== undefined) {
    //   manglicStatus[user.manglic ? 'Yes' : 'No']++;
    // }
    if (user.manglic) {
      const valicManglicStatus = ['Yes', 'No'];
      if (valicManglicStatus.includes(user.manglic)) {
        manglicStatus[user.manglic] = (manglicStatus[user.manglic] || 0) + 1;
      }
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
      }))
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
            <Users className="text-blue-500" size={24} />
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
                    ? 'bg-blue-500 text-white'
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