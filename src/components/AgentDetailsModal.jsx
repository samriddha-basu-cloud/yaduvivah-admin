import React from 'react';

const AgentDetailsModal = ({ agent, onClose }) => {
  const handleCopyReferenceCode = () => {
    navigator.clipboard.writeText(agent.referenceCode);
    alert('Reference code copied to clipboard!');
  };

  const InfoSection = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-orange-500 to-orange-400">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-8 -mt-16 relative overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="flex items-end mb-8">
            <div className="relative">
              <img
                src={agent.displayPictureUrl}
                alt={agent.name}
                className="w-28 h-28 rounded-xl border-4 border-white shadow-xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-6 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{agent.name}</h2>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                  <span className="text-orange-700 font-medium">{agent.referenceCode}</span>
                  <button
                    onClick={handleCopyReferenceCode}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <span className="text-gray-500 text-sm">
                  Joined {new Date(agent.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
            <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <InfoSection label="Email" value={agent.email} />
              <InfoSection label="Phone" value={agent.phoneNumber} />
              <InfoSection label="Date of Birth" value={agent.dob} />
              <InfoSection label="Age" value={agent.age} />
              <InfoSection label="Experience" value={`${agent.experience} years`} />
            </div>

            <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
              <InfoSection label="Address" value={`${agent.addressLine1}, ${agent.addressLine2}`} />
              <InfoSection label="District" value={agent.district} />
              <InfoSection label="State" value={agent.state} />
              <InfoSection label="Region" value={agent.region} />
              <InfoSection label="Pincode" value={agent.pincode} />
            </div>

            <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <InfoSection label="Status" value={agent.status} />
              <InfoSection label="Premium Users" value={agent.premiumUsers} />
              <InfoSection label="Total Users" value={agent.totalNumberofUsers} />
              <InfoSection label="Last Login" value={new Date(agent.lastLoginAt).toLocaleDateString()} />
            </div>

            <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aadhaar Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <img
                    src={agent.aadharFrontUrl}
                    alt="Aadhaar Front"
                    className="rounded-lg w-full h-40 object-cover shadow hover:shadow-lg transition-shadow"
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded-md">Front</span>
                </div>
                <div className="relative group">
                  <img
                    src={agent.aadharBackUrl}
                    alt="Aadhaar Back"
                    className="rounded-lg w-full h-40 object-cover shadow hover:shadow-lg transition-shadow"
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded-md">Back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;