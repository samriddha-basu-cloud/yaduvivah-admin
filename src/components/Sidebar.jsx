import React, { useState, useEffect } from 'react';
import { 
  Users, 
  HeadsetIcon, 
  Flag, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import logo from '../assets/Logo.png'; // Update the path to your logo

const Sidebar = ({ userCount, agentCount, reportedUserCount, activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
  
    handleResize(); // Set initial state based on screen size
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const menuItems = [
  { name: 'Users', icon: Users, count: userCount },
  { name: 'Agents', icon: HeadsetIcon, count: agentCount },
  { name: 'Reported Users', icon: Flag, count: reportedUserCount },
  { name: 'Analytics', icon: Settings } // New Analytics Tab
];


  return (
        <div 
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } min-h-screen bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out relative flex flex-col shadow-xl`}
    >
      {/* Toggle Button */}
      {window.innerWidth < 1024 && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-5 top-1/2 bg-blue-500 rounded-full p-1.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg w-10 h-10 flex items-center justify-center text-white"
        >
          {isCollapsed ? 
            <span className="transition-transform duration-300 ease-in-out transform hover:rotate-90">◎</span> : 
            <span className="transition-transform duration-300 ease-in-out transform hover:-rotate-90">◉</span>
          }
        </button>
      )}
    
      {/* Header */}
      <div className="px-6 py-8 border-b border-gray-800/60 mt-12 md:mt-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
            <img className="mx-auto" src={logo} alt="Logo" />
          </div>
          <h2 className={`font-bold transition-all duration-300 ${
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}>
            YaduVivah
          </h2>
        </div>
      </div>
    
      {/* Navigation */}
      <nav className="mt-6 flex-1">
        <ul className="space-y-1.5 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center px-4 py-3.5 rounded-lg transition-all duration-200 group
                    ${activeTab === item.name 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                      : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-between'}
                  `}
                >
                  <div className="flex items-center">
                    <Icon size={20} className={`${isCollapsed ? 'mx-auto' : 'mr-3'} 
                      ${activeTab === item.name ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} 
                    />
                    <span className={`${isCollapsed ? 'hidden' : 'block'} text-sm font-medium`}>
                      {item.name}
                    </span>
                  </div>
                  {!isCollapsed && item.count !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full 
                      ${activeTab === item.name 
                        ? 'bg-blue-500/30 text-white' 
                        : 'bg-gray-800 text-gray-400'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;