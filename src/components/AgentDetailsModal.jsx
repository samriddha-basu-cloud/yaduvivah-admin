import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { Calendar, MapPin, Briefcase, User, Phone, Mail, Clock, Heart, BookOpen, Users, Award } from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyCUqEZklvL_n9rwZ2v78vxXWVv6z_2ALUE",
  authDomain: "matri-site-cf115.firebaseapp.com",
  projectId: "matri-site-cf115",
  storageBucket: "matri-site-cf115.appspot.com",
  messagingSenderId: "231063048901",
  appId: "1:231063048901:web:968969b3f06dd22f1096ac",
  measurementId: "G-351NC8Z306",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const AgentDetailsModal = ({ agent, onClose }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('agentRefCode', '==', agent.referenceCode));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [agent.referenceCode]);

  const handleCopyReferenceCode = () => {
    navigator.clipboard.writeText(agent.referenceCode);
    alert('Reference code copied to clipboard!');
  };

  const InfoSection = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/6 bg-gradient-to-br from-orange-500 to-orange-600 p-4">
          <div className="relative flex justify-center sm:justify-start">
            {user.photos && user.photos.length > 0 ? (
              <img
                src={user.photos[0]}
                alt={user.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-white">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {user.verifiedByAdmin && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-3/4 p-4">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                <span>{`${user.district}, ${user.state}`}</span>
              </div>
            </div>
            <div className="mt-2 sm:mt-0 flex flex-col sm:items-end text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <Phone className="w-4 h-4" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <DetailMini icon={<Calendar className="w-4 h-4" />} label="Age" value={user.age} />
            <DetailMini icon={<Heart className="w-4 h-4" />} label="Status" value={user.status} />
            <DetailMini icon={<Briefcase className="w-4 h-4" />} label="Profession" value={user.profession} />
            <DetailMini icon={<BookOpen className="w-4 h-4" />} label="Education" value={user.highestQualification} />
          </div>
        </div>
      </div>
    </div>
  );

  const DetailMini = ({ icon, label, value }) => (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value || 'N/A'}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="relative h-24 sm:h-32 bg-gradient-to-r from-orange-500 to-orange-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 -mt-12 relative overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <div className="relative">
              <img
                src={agent.displayPictureUrl}
                alt={agent.name}
                className="w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{agent.name}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <div className="inline-flex items-center bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                  <span className="text-orange-700 text-sm font-medium">{agent.referenceCode}</span>
                  <button
                    onClick={handleCopyReferenceCode}
                    className="ml-2 text-orange-500 hover:text-orange-600"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <InfoSection label="Email" value={agent.email} />
              <InfoSection label="Phone" value={agent.phoneNumber} />
              <InfoSection label="Date of Birth" value={agent.dob} />
              <InfoSection label="Age" value={agent.age} />
              <InfoSection label="Experience" value={`${agent.experience} years`} />
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
              <InfoSection label="Address" value={`${agent.addressLine1}, ${agent.addressLine2}`} />
              <InfoSection label="District" value={agent.district} />
              <InfoSection label="State" value={agent.state} />
              <InfoSection label="Region" value={agent.region} />
              <InfoSection label="Pincode" value={agent.pincode} />
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <InfoSection label="Status" value={agent.status} />
              <InfoSection label="Premium Users" value={agent.premiumUsers} />
              <InfoSection label="Total Users" value={agent.totalNumberofUsers} />
              <InfoSection label="Last Login" value={new Date(agent.lastLoginAt).toLocaleDateString()} />
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Aadhaar Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <img
                    src={agent.aadharFrontUrl}
                    alt="Aadhaar Front"
                    className="rounded-lg w-full h-32 sm:h-40 object-cover shadow-sm hover:shadow-md transition-shadow"
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Front</span>
                </div>
                <div className="relative">
                  <img
                    src={agent.aadharBackUrl}
                    alt="Aadhaar Back"
                    className="rounded-lg w-full h-32 sm:h-40 object-cover shadow-sm hover:shadow-md transition-shadow"
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Back</span>
                </div>
              </div>
            </div>
          </div>

          {users.length > 0 && (
            <div className="mt-6 sm:mt-8 pb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Users</h3>
              <div className="grid grid-cols-1 gap-4">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;