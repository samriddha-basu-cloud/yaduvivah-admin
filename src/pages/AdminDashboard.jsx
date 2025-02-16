import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserTable from '../components/UserTable';
import AgentList from '../components/AgentList';
import UserModal from '../components/UserModal';
import ReportedUsersList from '../components/ReportedUsersList';
import AdminAnalytics from '../components/AdminAnalytics';
import { Loader2, RefreshCw, Menu } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [agentCount, setAgentCount] = useState(0);
  const [reportedUserCount, setReportedUserCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      const userData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setUsers(userData);
      setUserCount(userData.length);

      const agentsQuery = query(collection(db, 'agents'), orderBy('name', 'asc'));
      const agentsSnapshot = await getDocs(agentsQuery);
      const agentData = agentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAgents(agentData);
      setAgentCount(agentData.length);

      const reportedUsers = userData.filter(user => user.reported === true);
      setReportedUserCount(reportedUsers.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'unset';
  };

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar with responsive behavior */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          userCount={userCount}
          agentCount={agentCount}
          reportedUserCount={reportedUserCount}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            // Close sidebar on mobile when tab changes
            if (window.innerWidth < 1024) {
              setIsSidebarOpen(false);
            }
          }}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {activeTab}
                </h1>
                <button
                  onClick={fetchData}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="relative">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {activeTab === 'Users' ? (
                      <UserTable users={users} onView={handleViewUser} onVerify={() => {}} />
                    ) : activeTab === 'Agents' ? (
                      <AgentList agents={agents} />
                    ) : activeTab === 'Reported Users' ? (
                      <ReportedUsersList />
                    ) : activeTab === 'Analytics' ? (
                      <AdminAnalytics users={users} />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal with improved positioning */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseModal} />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <UserModal user={selectedUser} onClose={handleCloseModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;