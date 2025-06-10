// src/components/layout/Header.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HeaderProps } from '@/types';
import { Bell, User, Settings, LogOut } from 'lucide-react';

const Header: React.FC<HeaderProps> = ({ customer, alerts, className = '' }) => {
  const pathname = usePathname();
  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'Available' | 'Away' | 'DND' | 'Offline'>('Available');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract user name and generate initials
  const userName = "Anuraag Sakxena"; // This could come from props or context in real app
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const userInitials = getInitials(userName);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const statusOptions = [
    { label: 'Available', color: 'bg-green-500', icon: '●' },
    { label: 'Away', color: 'bg-yellow-500', icon: '●' },
    { label: 'DND', color: 'bg-red-500', icon: '●' },
    { label: 'Offline', color: 'bg-gray-400', icon: '●' }
  ];

  const getCurrentStatusColor = () => {
    const status = statusOptions.find(s => s.label === currentStatus);
    return status?.color || 'bg-green-500';
  };

  const handleStatusChange = (status: 'Available' | 'Away' | 'DND' | 'Offline') => {
    setCurrentStatus(status);
    setIsProfileDropdownOpen(false);
  };

  const isActivePage = (href: string) => {
    if (href === '/home' && pathname === '/') return true;
    return pathname === href;
  };

  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <Link href="/home" className="flex items-center">
            <Image
              src="/images/citi-logo.png"
              alt="Citi"
              width={60}
              height={30}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Right side - Navigation + User Profile */}
        <div className="flex items-center space-x-12">
          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/home" 
              className={`transition-colors text-base font-semibold ${
                isActivePage('/home') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/customer" 
              className={`transition-colors text-base font-semibold ${
                isActivePage('/customer') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Customer
            </Link>
            <Link 
              href="/availability" 
              className={`transition-colors text-base font-semibold ${
                isActivePage('/availability') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Availability
            </Link>
            <Link 
              href="/queues" 
              className={`transition-colors text-base font-semibold ${
                isActivePage('/queues') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Queues
            </Link>
            <Link 
              href="/tools" 
              className={`transition-colors text-base font-semibold ${
                isActivePage('/tools') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Tools
            </Link>
            <Link 
              href="/help" 
              className={`transition-colors text-base font-semibold ${
                isActivePage('/help') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Help
            </Link>
          </nav>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center hover:bg-gray-50 rounded-full p-1 transition-colors"
            >
              <div className="relative">
                {/* Initials Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {userInitials}
                </div>
                {/* Status indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getCurrentStatusColor()} rounded-full border-2 border-white`}></div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {userInitials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700">{userName}</div>
                      <div className="text-xs text-gray-500">Agent ID: A12345</div>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Set Status</div>
                  <div className="space-y-1">
                    {statusOptions.map((status) => (
                      <button
                        key={status.label}
                        onClick={() => handleStatusChange(status.label as any)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          currentStatus === status.label 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`w-3 h-3 ${status.color} rounded-full`}></div>
                        <span className="font-medium">{status.label}</span>
                        {currentStatus === status.label && (
                          <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;