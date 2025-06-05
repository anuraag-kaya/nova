// src/app/home/page.tsx

"use client";

import Layout from '../../../components/layout/layout';
import { User, Clock, Bell, ExternalLink, ChevronRight, Search, Plus, X } from 'lucide-react';
import { useState } from 'react';

// Mock data for the dashboard
const pendingQueueData = {
  total: 573,
  pastDue: 179,
  scheduledToday: 394
};

const alertsData = [
  { id: 1, title: "System Maintenance Scheduled", type: "info", isRead: false },
  { id: 2, title: "New Policy Update Available", type: "warning", isRead: false },
  { id: 3, title: "Training Session Tomorrow", type: "info", isRead: true }
];

const quickLinksData = [
  "Employee Directory",
  "ESP (Employee Schedule Planner)",
  "Online Scorecard",
  "Site Intranet",
  "Calculate Financials",
  "Tester",
  "Tester",
  "Tester",
  "Tester"
];

const citiLinksData = [
  "Cards HR",
  "CitiCards Human",
  "Citi News",
  "CitiCards",
  "Citigroup Today",
  "Citi Training Portal",
  "Citi Employee Service Line",
  "How2",
  "Echnet"
];

const availableServices = [
  "Accidental Enrollment",
  "Account Details",
  "Activate Cards",
  "Add / Edit User",
  "Add Block",
  "Add Notes",
  "All Payment History"
];

const favoriteServices = [
  "Activate Cards",
  "Account Details",
  "All Payment History"
];

const currentRoleData = {
  current: "Tester",
  otherRoles: [
    { name: "Tester", time: "1h" },
    { name: "Elite", time: "23m" },
    { name: "Service Elite", time: "2d" }
  ]
};

export default function AgentHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>(favoriteServices);

  const addToFavorites = (service: string) => {
    if (!selectedFavorites.includes(service)) {
      setSelectedFavorites([...selectedFavorites, service]);
    }
  };

  const removeFromFavorites = (service: string) => {
    setSelectedFavorites(selectedFavorites.filter(s => s !== service));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Main Content */}
        <div className="p-8">
          
          {/* Welcome Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, Anuraag Sakxena</h1>
              <p className="text-gray-600 mt-1">Agent Home Page</p>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Pending Queue Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Queue</h2>
                
                <div className="flex items-center space-x-8">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(pendingQueueData.scheduledToday / pendingQueueData.total) * 220} 220`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#fb923c" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{pendingQueueData.total}</span>
                      <span className="text-sm text-gray-600">items</span>
                    </div>
                  </div>
                  
                  {/* Queue Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-600">Past Due Items</span>
                      <span className="text-xl font-bold text-gray-900">{pendingQueueData.pastDue}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Scheduled Today</span>
                      <span className="text-xl font-bold text-gray-900">{pendingQueueData.scheduledToday}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Favorites Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Favorites</h2>
                <p className="text-sm text-blue-600 mb-6">Select Up To Seven Favorites And Add Them To Your List</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Available Services */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Services</h3>
                    
                    {/* Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Service List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableServices
                        .filter(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                          <span className="text-sm text-gray-700">{service}</span>
                          <button
                            onClick={() => addToFavorites(service)}
                            disabled={selectedFavorites.includes(service)}
                            className={`p-1 rounded-full transition-colors ${
                              selectedFavorites.includes(service)
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-blue-500 hover:bg-blue-50 group-hover:opacity-100 opacity-0'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Favorite Services */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Favorite Services</h3>
                    <div className="space-y-2">
                      {selectedFavorites.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 group">
                          <span className="text-sm font-medium text-blue-700">{service}</span>
                          <button
                            onClick={() => removeFromFavorites(service)}
                            className="p-1 rounded-full text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {selectedFavorites.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No favorites selected</p>
                          <p className="text-xs mt-1">Add services from the left to get started</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedFavorites.length > 0 && (
                      <div className="mt-4 flex justify-end">
                        <button className="text-sm text-red-600 hover:text-red-700 transition-colors">
                          Remove All
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Content */}
            <div className="space-y-6">
              
              {/* Alerts Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 mb-4 flex items-center">
                  View All Current Agent Alerts
                  <ExternalLink className="w-3 h-3 ml-1" />
                </button>
                <div className="space-y-2">
                  {alertsData.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${alert.isRead ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                        <span className="text-xs text-gray-600 truncate">{alert.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-1">
                  {quickLinksData.map((link, index) => (
                    <button key={index} className="w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors">
                      {link}
                    </button>
                  ))}
                </div>
              </div>

              {/* Citi Links */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Citi Links</h3>
                <div className="space-y-1">
                  {citiLinksData.map((link, index) => (
                    <button key={index} className="w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors">
                      {link}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Role */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Current Role: {currentRoleData.current}</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                    Change Role
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Other Roles</h4>
                  {currentRoleData.otherRoles.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <span className="text-sm text-gray-600">{role.name}</span>
                      <span className="text-xs text-gray-500 font-medium">{role.time}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                    See More
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Date */}
          <div className="mt-8 text-left">
            <span className="text-sm text-gray-600">Wednesday, May 28, 2025</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}