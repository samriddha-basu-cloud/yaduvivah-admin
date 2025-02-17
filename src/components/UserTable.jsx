import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { User, Check, X, Eye, Shield, ShieldOff, Search, ArrowUp, ArrowDown, Trash2, MoreVertical } from "lucide-react";
import UserModal from "./UserModal";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'asc' });
  const [userToDelete, setUserToDelete] = useState(null);
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [showUnverifyDialog, setShowUnverifyDialog] = useState(false);
  const [unverifyText, setUnverifyText] = useState("");
  const [userToUnverify, setUserToUnverify] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

    const toggleVerification = async (user) => {
    if (user.verifiedByAdmin) {
      setUserToUnverify(user);
      setShowUnverifyDialog(true);
    } else {
      try {
        const userRef = doc(db, "users", user.id);
        const newStatus = !user.verifiedByAdmin;
        await updateDoc(userRef, { 
          verifiedByAdmin: newStatus,
          adminTexts: "" // Clear adminTexts field
        });
        setUsers(prevUsers =>
          prevUsers.map(u => u.id === user.id ? { ...u, verifiedByAdmin: newStatus } : u)
        );
  
        const message = "You can access the account now. It has been verified by admin.";
        const whatsappUrl = `https://wa.me/${user.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      } catch (error) {
        console.error("Error updating verification status:", error);
      }
    }
  };


  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const sortedAndFilteredUsers = [...users]
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      return sortConfig.direction === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    })
    .filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    });

  const isReported = (reportReason) => {
    if (!Array.isArray(reportReason)) return false;
    return reportReason.some(reason => 
      ['fakeProfile', 'harassment', 'inappropriateContent', 'spam'].includes(reason)
    );
  };

  // Mobile action menu component
    // Mobile action menu component
  const ActionMenu = ({ user }) => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
      <button
        onClick={() => {
          setSelectedUser(user);
          setShowActionsFor(null);
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <Eye className="w-4 h-4" /> View Details
      </button>
      <button
        onClick={() => toggleVerification(user)}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
      >
        {user.verifiedByAdmin ? (
          <>
            <ShieldOff className="w-4 h-4 text-red-500" /> UnVerify User
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 text-green-500" /> Verify User
          </>
        )}
      </button>
      <button
        onClick={() => {
          setUserToDelete(user);
          setShowActionsFor(null);
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" /> Delete User
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Total Users: {users.length}</h2>
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-4 text-left font-medium text-gray-500">User</th>
              <th className="hidden md:table-cell py-3 px-4 text-left font-medium text-gray-500">Email</th>
              <th className="hidden sm:table-cell py-3 px-4 text-left font-medium text-gray-500">Status</th>
              <th 
                onClick={() => setSortConfig({ 
                  key: 'createdAt', 
                  direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' 
                })}
                className="hidden lg:table-cell py-3 px-4 text-left font-medium text-gray-500 cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  Joined
                  {sortConfig.key === 'createdAt' && (
                    sortConfig.direction === 'asc' ? 
                    <ArrowUp className="w-4 h-4" /> : 
                    <ArrowDown className="w-4 h-4" />
                  )}
                </span>
              </th>
              <th className="py-3 px-4 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`border-b border-gray-200 hover:bg-gray-50 ${
                  isReported(user.reportReason) ? 'bg-red-50' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {user.photos?.[0] ? (
                        <img
                          src={user.photos[0]}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{user.name || "N/A"}</div>
                      <div className="text-gray-500 text-xs md:hidden truncate">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell py-3 px-4 text-gray-500">{user.email}</td>
                <td className="hidden sm:table-cell py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    user.verifiedByAdmin ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {user.verifiedByAdmin ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {user.verifiedByAdmin ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="hidden lg:table-cell py-3 px-4 text-gray-500">
                  {user.createdAt
                    ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="py-3 px-4 text-right relative">
                  {/* Desktop actions */}
                  <div className="hidden sm:flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => toggleVerification(user)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      {user.verifiedByAdmin ? (
                        <ShieldOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Shield className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  
                  {/* Mobile actions */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setShowActionsFor(showActionsFor === user.id ? null : user.id)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    {showActionsFor === user.id && <ActionMenu user={user} />}
                  </div>
                </td>
              </tr>
            ))}
            
            {sortedAndFilteredUsers.length === 0 && !isLoading && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
            
            {isLoading && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedUser && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedUser(null)} />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-2xl transform rounded-lg bg-white shadow-xl transition-all mb-8">
                <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setUserToDelete(null)} />
            <div className="relative bg-white rounded-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold text-gray-800">Delete User</h2>
              <p className="mt-2 text-gray-600">Are you sure you want to delete this user?</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteUser(userToDelete.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUnverifyDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowUnverifyDialog(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold text-gray-800">Unverify User</h2>
              <p className="mt-2 text-gray-600">Please provide a reason for unverifying this user:</p>
              <textarea
                value={unverifyText}
                onChange={(e) => setUnverifyText(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                rows="4"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowUnverifyDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const userRef = doc(db, "users", userToUnverify.id);
                      await updateDoc(userRef, { 
                        verifiedByAdmin: false,
                        adminTexts: unverifyText
                      });
                      setUsers(prevUsers =>
                        prevUsers.map(u => u.id === userToUnverify.id ? { ...u, verifiedByAdmin: false } : u)
                      );
      
                      const message = "Your access to yaduvivah.com is restricted by the admin due to reports by other users.";
                      const whatsappUrl = `https://wa.me/${userToUnverify.phone}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, "_blank");
                    } catch (error) {
                      console.error("Error updating verification status:", error);
                    } finally {
                      setShowUnverifyDialog(false);
                      setUnverifyText("");
                      setUserToUnverify(null);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;