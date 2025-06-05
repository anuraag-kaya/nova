// src/components/ui/MiddlePanel.tsx

"use client";

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, Download, Search, Filter, MoreHorizontal } from 'lucide-react';

export interface MiddlePanelTab {
  id: string;
  label: string;
  badge?: number;
  isActive?: boolean;
}

export interface MiddlePanelAlert {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  isVisible: boolean;
}

export interface MiddlePanelColumn {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface MiddlePanelRow {
  id: string;
  [key: string]: any;
}

export interface MiddlePanelAction {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: React.ReactNode;
}

export interface MiddlePanelProps {
  title: string;
  subtitle: string;
  tabs: MiddlePanelTab[];
  alert?: MiddlePanelAlert;
  columns: MiddlePanelColumn[];
  data: MiddlePanelRow[];
  actions: MiddlePanelAction[];
  onTabChange?: (tabId: string) => void;
  onActionClick?: (actionId: string) => void;
  className?: string;
}

const MiddlePanel: React.FC<MiddlePanelProps> = ({
  title,
  subtitle,
  tabs,
  alert,
  columns,
  data,
  actions,
  onTabChange,
  onActionClick,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(tabs.find(tab => tab.isActive)?.id || tabs[0]?.id);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(selectedRows.length === data.length ? [] : data.map(row => row.id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getActionButtonStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg';
      case 'secondary':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300';
      case 'outline':
        return 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white shadow-md';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            </div>
            
            {/* Table Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Alert Box */}
          {alert && alert.isVisible && (
            <div className={`flex items-start space-x-3 p-4 rounded-lg border ${getAlertStyles(alert.type)}`}>
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1">{alert.title}</h4>
                <p className="text-sm">{alert.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === data.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                      style={{ width: column.width }}
                    >
                      {column.sortable ? (
                        <button
                          onClick={() => handleSort(column.id)}
                          className="group inline-flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>{column.label}</span>
                          <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-700">
                            {sortColumn === column.id ? (
                              sortDirection === 'asc' ? '↑' : '↓'
                            ) : '↕'}
                          </span>
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedRows.includes(row.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                          column.align === 'center' ? 'text-center' : 
                          column.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {row[column.id] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="flex items-center justify-start space-x-4 mt-6">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => onActionClick?.(action.id)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getActionButtonStyles(action.variant)}`}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Selection Info */}
        {selectedRows.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{selectedRows.length}</span> item{selectedRows.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiddlePanel;