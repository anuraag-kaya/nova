// src/components/layout/Layout.tsx

"use client";

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { mockCustomer, mockAlerts } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '', 
  showSidebar = true
}) => {
  return (
    <div className={`h-screen bg-gray-50 flex flex-col ${className}`}>
      {/* Header - Clean navigation only */}
      <div className="flex-shrink-0">
        <Header 
          customer={mockCustomer} 
          alerts={mockAlerts} 
        />
      </div>
      
      {/* Content Area - Sidebar + Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Takes full remaining height */}
        {showSidebar && (
          <div className="flex-shrink-0 h-full">
            <Sidebar />
          </div>
        )}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;