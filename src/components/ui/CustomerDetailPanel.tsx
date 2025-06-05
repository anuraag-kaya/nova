// src/components/ui/CustomerDetailPanel.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Customer, AccountAlert } from '@/types';
import { User, Clock, Globe, AlertTriangle, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface CustomerDetailPanelProps {
  customer: Customer;
  alerts: AccountAlert[];
  className?: string;
  defaultExpanded?: boolean;
}

const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({ 
  customer, 
  alerts, 
  className = '',
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-amber-500" />;
      case 'info':
        return <Info className="w-3 h-3 text-blue-500" />;
      default:
        return <CheckCircle2 className="w-3 h-3 text-green-500" />;
    }
  };

  const getRelationshipBadgeColor = (relationship: string) => {
    switch (relationship) {
      case 'PRIMARY':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md';
      case 'JOINT':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md';
      case 'AUTHORIZED':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md';
    }
  };

  const urgentAlerts = alerts.filter(alert => alert.type === 'error' || alert.type === 'warning');

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      
      {/* Compact Header - Always Visible */}
      <div 
        className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          
          {/* Left Side - Customer Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                  {customer.primaryName}
                </h3>
                <p className="text-sm text-gray-600">
                  Communicating with {customer.communicatingWith}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Status & Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Urgent Alerts Indicator */}
            {urgentAlerts.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">
                  {urgentAlerts.length} Alert{urgentAlerts.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Relationship Badge */}
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRelationshipBadgeColor(customer.relationship)}`}>
              {customer.relationship}
            </div>

            {/* Expand/Collapse Button */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-600 transition-transform duration-200" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6 border-t border-gray-100">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Customer Details - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                  <div className="w-1 h-4 bg-blue-500 rounded-full mr-2"></div>
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Name</label>
                    <div className="text-base font-semibold text-gray-900 mt-1">{customer.preferredName}</div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Communication Partner</label>
                    <div className="text-base font-semibold text-gray-900 mt-1 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {customer.communicatingWith}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Preferences */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                  <div className="w-1 h-4 bg-purple-500 rounded-full mr-2"></div>
                  Preferences
                </h4>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-900">{customer.language}</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-purple-900">{customer.timezone}</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                    <User className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-900">{customer.relationship}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Alerts - 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                    Alerts ({alerts.length})
                  </h4>
                  <Link 
                    href="/alerts" 
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center group"
                  >
                    Manage
                    <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </Link>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {alerts.slice(0, 4).map((alert, index) => (
                    <Link
                      key={alert.id}
                      href={`/alerts/${alert.id}`}
                      className="flex items-center space-x-2 p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all duration-200 group"
                    >
                      <span className="text-xs font-medium text-gray-500">{index + 1}.</span>
                      {getAlertIcon(alert.type)}
                      <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors duration-200 flex-1 truncate">
                        {alert.title}
                      </span>
                    </Link>
                  ))}
                  
                  {alerts.length > 4 && (
                    <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                      +{alerts.length - 4} more alerts
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPanel;