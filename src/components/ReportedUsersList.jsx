import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Eye,
  Loader2,
  AlertTriangle,
  Users,
  Mail,
  Search,
  AlertOctagon,
  Flag,
  User,
  CheckCircle,
  Calendar
} from 'lucide-react';
import UsersModal from '../components/UserModal';

const ReportedUsersList = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchReportedUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const reportedUsersData = userSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.reported === true);

        setReportedUsers(reportedUsersData);
      } catch (error) {
        console.error('Error fetching reported users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedUsers();
  }, []);

  const getReportReasons = (user) => {
    const reasons = [];
    const reportReasons = Array.isArray(user.reportReason) ? user.reportReason : [];
    if (reportReasons.includes('fakeProfile')) reasons.push({ type: 'Fake Profile', icon: User });
    if (reportReasons.includes('harassment')) reasons.push({ type: 'Harassment', icon: Flag });
    if (reportReasons.includes('inappropriateContent')) reasons.push({ type: 'Inappropriate Content', icon: AlertOctagon });
    if (reportReasons.includes('spam')) reasons.push({ type: 'Spam', icon: AlertTriangle });
    return reasons;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = reportedUsers
    .filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      return sortConfig.direction === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

  const SortIndicator = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const UserCard = ({ user }) => {
    const reasons = getReportReasons(user);
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {user.photos?.[0] || user.photoURL ? (
                  <img
                    src={user.photos?.[0] || user.photoURL}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              {user.verifiedByAdmin && (
                <CheckCircle className="w-5 h-5 text-blue-500 absolute -right-1 -bottom-1 bg-white rounded-full" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name || 'No Name'}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email || 'No Email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Joined: {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Report Reasons:</div>
            <div className="flex flex-wrap gap-2">
              {reasons.map(({ type, icon: Icon }, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700"
                >
                  <Icon className="w-3 h-3" />
                  {type}
                </span>
              ))}
              {reasons.length === 0 && (
                <span className="text-gray-400 text-sm">No specific reasons provided</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reported Users</h1>
              <p className="text-gray-500">Managing user reports and violations</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-500">Loading reported users...</p>
            </div>
          </div>
        ) : reportedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
            <Users className="h-12 w-12 mb-2 text-gray-400" />
            <p className="text-lg text-gray-900 font-medium">No reported users found</p>
            <p className="text-sm text-gray-500">When users are reported, they will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <UsersModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default ReportedUsersList;