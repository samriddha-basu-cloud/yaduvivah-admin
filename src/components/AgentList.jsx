import React from 'react';

const AgentList = ({ agents }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reference Code</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Registered Users</th>
          </tr>
        </thead>
        <tbody>
          {agents.length > 0 ? (
            agents.map((agent) => (
              <tr key={agent.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{agent.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{agent.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{agent.referenceCode}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{agent.totalNumberofUsers || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                No agents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgentList;
