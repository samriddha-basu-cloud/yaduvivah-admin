import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { X, AlertCircle, User, Flag, AlertOctagon, AlertTriangle } from 'lucide-react';

const RemoveReportDialog = ({ user, onClose, onReportsRemoved }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);

  const handleReasonChange = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleRemoveReports = async () => {
    const updatedReasons = user.reportReason.filter(
      (reason) => !selectedReasons.includes(reason)
    );

    await updateDoc(doc(db, 'users', user.id), {
      reportReason: updatedReasons,
      reported: updatedReasons.length > 0,
    });

    onReportsRemoved();
    onClose();
  };

  const getReasonDetails = (reason) => {
    const reasons = {
      fakeProfile: {
        label: 'Fake Profile',
        icon: User,
        description: 'Account suspected of impersonation or false identity'
      },
      harassment: {
        label: 'Harassment',
        icon: Flag,
        description: 'Reported for harassing behavior or bullying'
      },
      inappropriateContent: {
        label: 'Inappropriate Content',
        icon: AlertOctagon,
        description: 'Posted content that violates community guidelines'
      },
      spam: {
        label: 'Spam',
        icon: AlertTriangle,
        description: 'Excessive or unwanted promotional content'
      }
    };
    
    return reasons[reason] || {
      label: reason,
      icon: AlertCircle,
      description: 'Other reported behavior'
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Remove Report Reasons</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Select the report reasons you want to remove for user: 
            <span className="font-medium text-gray-900 ml-1">{user.name || 'Unnamed User'}</span>
          </p>
          
          <div className="space-y-3">
            {user.reportReason.map((reason) => {
              const { label, icon: Icon, description } = getReasonDetails(reason);
              return (
                <label
                  key={reason}
                  className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id={reason}
                      checked={selectedReasons.includes(reason)}
                      onChange={() => handleReasonChange(reason)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{label}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveReports}
              disabled={selectedReasons.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Selected Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveReportDialog;