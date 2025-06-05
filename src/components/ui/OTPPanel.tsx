// src/components/ui/OTPPanel.tsx

"use client";

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, Phone, MessageSquare, Shield, Clock } from 'lucide-react';

export interface OTPPanelTab {
  id: string;
  label: string;
  badge?: number;
  isActive?: boolean;
}

export interface OTPPanelAlert {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  isVisible: boolean;
}

export interface PhoneNumber {
  id: string;
  type: string;
  number: string;
  canSend: boolean;
}

export interface OTPPanelProps {
  title: string;
  subtitle: string;
  tabs: OTPPanelTab[];
  alert?: OTPPanelAlert;
  phoneNumbers: PhoneNumber[];
  onTabChange?: (tabId: string) => void;
  onSendOTP?: (phoneId: string, phoneNumber: string) => void;
  onRefuseText?: () => void;
  onNoTextCapability?: () => void;
  className?: string;
}

const OTPPanel: React.FC<OTPPanelProps> = ({
  title,
  subtitle,
  tabs,
  alert,
  phoneNumbers,
  onTabChange,
  onSendOTP,
  onRefuseText,
  onNoTextCapability,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(tabs.find(tab => tab.isActive)?.id || tabs[0]?.id);
  const [otherPhoneNumber, setOtherPhoneNumber] = useState('');
  const [sendingOTP, setSendingOTP] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleSendOTP = async (phoneId: string, phoneNumber: string) => {
    setSendingOTP(phoneId);
    
    // Simulate sending delay
    setTimeout(() => {
      setSendingOTP(null);
      onSendOTP?.(phoneId, phoneNumber);
    }, 1500);
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

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200/50">
        <nav className="flex space-x-8 px-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`py-5 px-2 border-b-3 font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                    activeTab === tab.id ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'
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
      <div className="p-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{title}</h2>
              <p className="text-base font-medium text-gray-600">{subtitle}</p>
            </div>
            
            {/* Security Badge */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl shadow-sm">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-blue-700">Security Verification</span>
            </div>
          </div>

          {/* Alert Box */}
          {alert && alert.isVisible && (
            <div className={`flex items-start space-x-4 p-6 rounded-2xl border-2 shadow-lg backdrop-blur-sm ${getAlertStyles(alert.type)}`}>
              <div className="flex-shrink-0 mt-1">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold mb-3">{alert.title}</h4>
                <p className="text-sm leading-relaxed">{alert.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Phone Numbers Section */}
        <div className="space-y-6">
          {phoneNumbers.map((phone) => (
            <div key={phone.id} className="group">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300/50">
                
                {/* Left Side - Phone Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <label className="text-base font-semibold text-gray-900 block mb-1">
                      {phone.type}:
                    </label>
                    {phone.id === 'other' ? (
                      <input
                        type="tel"
                        value={otherPhoneNumber}
                        onChange={(e) => setOtherPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold text-gray-800 bg-white/90 backdrop-blur-sm shadow-sm"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-800">
                        {phone.number}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side - Send Button */}
                <button
                  onClick={() => handleSendOTP(phone.id, phone.id === 'other' ? otherPhoneNumber : phone.number)}
                  disabled={sendingOTP === phone.id || (phone.id === 'other' && !otherPhoneNumber.trim())}
                  className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    sendingOTP === phone.id
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : phone.id === 'other' && !otherPhoneNumber.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
                  }`}
                >
                  {sendingOTP === phone.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      SEND
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center justify-start space-x-4 mt-8 pt-6 border-t border-gray-200/50">
          <button
            onClick={onRefuseText}
            className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Refused Text
          </button>
          
          <button
            onClick={onNoTextCapability}
            className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Clock className="w-4 h-4 mr-2" />
            No Text Capability
          </button>
        </div>

        {/* Information Footer */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-200/30">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">
              Standard messaging rates apply. Customer will receive a text message with a verification code.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPanel;