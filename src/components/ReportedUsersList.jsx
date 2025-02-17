import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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
  Calendar,
  Menu
} from 'lucide-react';
import UsersModal from '../components/UserModal';
import RemoveReportDialog from '../components/RemoveReportDialog';

const ReportedUsersList = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isSearchVisible, setIsSearchVisible] = useState(false);

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

  // const getReportReasons = (user) => {
  //   const reasons = [];
  //   const reportReasons = Array.isArray(user.reportReason) ? user.reportReason : [];
  //   if (reportReasons.includes('fakeProfile')) reasons.push({ type: 'Fake Profile', icon: User });
  //   if (reportReasons.includes('harassment')) reasons.push({ type: 'Harassment', icon: Flag });
  //   if (reportReasons.includes('inappropriateContent')) reasons.push({ type: 'Inappropriate Content', icon: AlertOctagon });
  //   if (reportReasons.includes('spam')) reasons.push({ type: 'Spam', icon: AlertTriangle });
  //   return reasons;
  // };

  const handleUserRemoval = (userId) => {
    setReportedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
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

  const UserCard = ({ user }) => {
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [reportReasons, setReportReasons] = useState(user.reportReason);


    const getReportReasons = () => {
      const reasons = [];
      const reportReasonsArray = Array.isArray(reportReasons) ? reportReasons : [];
      if (reportReasonsArray.includes('fakeProfile')) reasons.push({ type: 'Fake Profile', icon: User });
      if (reportReasonsArray.includes('harassment')) reasons.push({ type: 'Harassment', icon: Flag });
      if (reportReasonsArray.includes('inappropriateContent')) reasons.push({ type: 'Inappropriate Content', icon: AlertOctagon });
      if (reportReasonsArray.includes('spam')) reasons.push({ type: 'Spam', icon: AlertTriangle });
      return reasons;
    };

    const handleReportsRemoved = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.id));
      const updatedReportReasons = userDoc.data().reportReason;
      setReportReasons(updatedReportReasons);

      if (updatedReportReasons.length === 0) {
        handleUserRemoval(user.id);
      }
    };

    const reasons = getReportReasons();

    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className="relative self-center sm:self-start">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {user.photos?.[0] || user.photoURL ? (
                  <img
                    src={user.photos?.[0] || user.photoURL}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                )}
              </div>
              {user.verifiedByAdmin && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 absolute -right-1 -bottom-1 bg-white rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 sm:gap-0">
                <div className="text-center sm:text-left w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{user.name || 'No Name'}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email || 'No Email'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
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
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
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

          <button
            onClick={() => setShowRemoveDialog(true)}
            className="mt-4 w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Remove Reports
          </button>
        </div>

        {showRemoveDialog && (
          <RemoveReportDialog
            user={user}
            onClose={() => setShowRemoveDialog(false)}
            onReportsRemoved={handleReportsRemoved}
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reported Users</h1>
              <p className="text-sm sm:text-base text-gray-500">Managing user reports and violations</p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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