"use client";

// src/components/layout/Sidebar.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SidebarProps } from '@/types';
import { mockSidebarSections, mockActivityItems, mockOffers } from '@/data/mockData';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar,
  Star,
  Zap,
  TrendingUp,
  Shield,
  Settings,
  Bell,
  User,
  Home,
  CreditCard,
  FileText,
  MessageSquare,
  Gift,
  BarChart3,
  Percent
} from 'lucide-react';

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // CHANGED: Only 'services' is expanded by default, not 'activity'
  const [expandedSections, setExpandedSections] = useState<string[]>(['services']);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchFocused, setSearchFocused] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'in-progress':
        return <Circle className="w-4 h-4 text-blue-500 fill-current animate-pulse" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNavIcon = (itemId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'account-billing': <CreditCard className="w-4 h-4" />,
      'cards': <CreditCard className="w-4 h-4" />,
      'case-management': <FileText className="w-4 h-4" />,
      'checks-bi': <BarChart3 className="w-4 h-4" />,
      'customer-details': <User className="w-4 h-4" />,
      'offers-features': <Gift className="w-4 h-4" />
    };
    return iconMap[itemId] || <Circle className="w-3 h-3" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <aside className={`w-72 h-full flex flex-col relative ${className}`}>
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-gray-50/95 via-white/90 to-gray-100/95 border-r border-gray-200/50 shadow-xl"></div>
      
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/2 to-indigo-500/3"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        
        {/* Enhanced Search Section */}
        <div className="p-6 flex-shrink-0">
          <div className="relative group">
            <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
              searchFocused 
                ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-lg shadow-blue-500/20' 
                : 'bg-white/60 shadow-sm'
            }`}></div>
            
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                searchFocused ? 'text-blue-500 w-5 h-5' : 'text-gray-400 w-4 h-4'
              }`} />
              <input
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-sm font-medium placeholder-gray-500 text-gray-800"
              />
            </div>
            
            {/* Search suggestions overlay */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl z-10 overflow-hidden">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Access</div>
                  <Link href="/customer" className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-blue-50/80 transition-colors group">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Customer Details</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Sections - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {mockSidebarSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            
            return (
              <div key={section.id} className="group">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 group-hover:shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 tracking-tight">{section.title}</span>
                  </div>
                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
                
                {/* Expandable Content with smooth animation */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="ml-4 pl-4 border-l-2 border-gray-200/50 space-y-1 pb-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          item.isActive
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 shadow-sm' 
                            : 'hover:bg-white/60 hover:shadow-sm'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                          item.isActive 
                            ? 'bg-blue-500 shadow-md' 
                            : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                          <div className={item.isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}>
                            {getNavIcon(item.id)}
                          </div>
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                          item.isActive 
                            ? 'text-blue-700 font-semibold' 
                            : 'text-gray-700 group-hover:text-blue-600'
                        }`}>
                          {item.label}
                        </span>
                        {item.isActive && (
                          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Enhanced Activity Section - Now Expandable and NOT expanded by default */}
          <div className="mt-8 group">
            <button
              onClick={() => toggleSection('activity')}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 group-hover:shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 tracking-tight">Recent Activity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className={`transform transition-transform duration-300 ${expandedSections.includes('activity') ? 'rotate-90' : ''}`}>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </button>
            
            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
              expandedSections.includes('activity') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="ml-4 pl-4 border-l-2 border-gray-200/50 pb-2">
                <div className="mt-2 p-4 bg-white/60 rounded-xl border border-gray-200/50 shadow-sm backdrop-blur-sm">
                  <div className="space-y-3">
                    {mockActivityItems.map((activity, index) => (
                      <div key={activity.id} className="group cursor-pointer">
                        <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/80 transition-all duration-300 hover:shadow-sm">
                          {/* Enhanced Status Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="relative">
                              {getStatusIcon(activity.status)}
                              {activity.status === 'in-progress' && (
                                <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping"></div>
                              )}
                            </div>
                          </div>
                          
                          {/* Activity Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-300 truncate">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">{activity.date}</p>
                            
                            {/* Progress bar for in-progress items */}
                            {activity.status === 'in-progress' && (
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{width: '65%'}}></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All Activities Link */}
                  <Link 
                    href="/activity" 
                    className="block mt-4 text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 py-2 rounded-xl hover:bg-blue-50/50"
                  >
                    View All Activities →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: Offers Section - NOT expanded by default */}
          <div className="mt-8 group">
            <button
              onClick={() => toggleSection('offers')}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 group-hover:shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Percent className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800 tracking-tight">Offers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <div className={`transform transition-transform duration-300 ${expandedSections.includes('offers') ? 'rotate-90' : ''}`}>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </button>
            
            {/* Expandable Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
              expandedSections.includes('offers') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="ml-4 pl-4 border-l-2 border-gray-200/50 pb-2">
                <div className="mt-2 p-4 bg-white/60 rounded-xl border border-gray-200/50 shadow-sm backdrop-blur-sm">
                  <div className="space-y-2">
                    {mockOffers.map((offer, index) => (
                      <Link
                        key={offer.id}
                        href={offer.href}
                        className="block p-3 rounded-xl hover:bg-white/80 transition-all duration-300 hover:shadow-sm group"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500">{index + 1}.</span>
                          <span className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300 underline underline-offset-2 decoration-1 hover:decoration-2 font-medium">
                            {offer.label}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* View All Offers Link */}
                  <Link 
                    href="/offers" 
                    className="block mt-4 text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 py-2 rounded-xl hover:bg-blue-50/50"
                  >
                    View All Offers →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Date Component */}
        <div className="flex-shrink-0 mx-4 mb-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm px-4 py-3">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Today</div>
              <div className="text-sm font-semibold text-gray-800">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;