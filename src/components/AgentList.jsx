import React, { useState } from 'react';
import AgentDetailsModal from './AgentDetailsModal';

const AgentList = ({ agents }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent);
  };

  const handleCloseModal = () => {
    setSelectedAgent(null);
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Card view for mobile screens
  const MobileCard = ({ agent }) => (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <div className="relative">
          <img
            src={agent.displayPictureUrl}
            alt={agent.name.charAt(0).toUpperCase()}
            className="w-12 h-12 object-cover rounded-xl"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{agent.name}</h3>
          <p className="text-sm text-gray-500">{agent.email}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="px-3 py-1 bg-orange-50 rounded-lg">
          <span className="text-sm text-orange-600 font-medium">
            {agent.totalNumberofUsers || 0} users
          </span>
        </div>
        <button
          onClick={() => handleViewDetails(agent)}
          className="px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-orange-100 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          placeholder="Search agents by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table view for larger screens */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-orange-100">
        <table className="min-w-full divide-y divide-orange-100">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                Registered Users
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-orange-100">
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <tr 
                  key={agent.id} 
                  className="hover:bg-orange-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={agent.displayPictureUrl}
                          alt={agent.name.charAt(0).toUpperCase()}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {agent.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-sm text-orange-600 bg-orange-50 rounded-lg">
                      {agent.totalNumberofUsers || 0} users
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewDetails(agent)}
                      className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan="4" 
                  className="px-6 py-10 text-center text-sm text-gray-500 bg-orange-50/50"
                >
                  <div className="flex flex-col items-center">
                    <svg 
                      className="w-12 h-12 text-orange-300 mb-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                      />
                    </svg>
                    <span>No agents found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile screens */}
      <div className="md:hidden space-y-4">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <MobileCard key={agent.id} agent={agent} />
          ))
        ) : (
          <div className="text-center py-10 bg-orange-50/50 rounded-xl border border-orange-100">
            <svg 
              className="w-12 h-12 text-orange-300 mx-auto mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
              />
            </svg>
            <span className="text-sm text-gray-500">No agents found</span>
          </div>
        )}
      </div>

      {selectedAgent && (
        <AgentDetailsModal agent={selectedAgent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AgentList;