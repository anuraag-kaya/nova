// src/app/otp/page.tsx

"use client";

import Layout from '../../../components/layout/layout';
import CustomerDetailPanel from '@/components/ui/CustomerDetailPanel';
import OTPPanel from '@/components/ui/OTPPanel';
import CallPanel from '@/components/ui/CallPanel';
import { 
  mockCustomer, 
  mockAlerts, 
  mockOTPTabs,
  mockOTPAlert,
  mockPhoneNumbers
} from '@/data/mockData';

export default function OTPPage() {
  const handleTabChange = (tabId: string) => {
    console.log('Tab changed to:', tabId);
  };

  const handleSendOTP = (phoneId: string, phoneNumber: string) => {
    console.log(`Sending OTP to ${phoneId}: ${phoneNumber}`);
    alert(`OTP sent to ${phoneNumber}! Please ask the customer to check their messages.`);
  };

  const handleRefuseText = () => {
    console.log('Customer refused text verification');
    alert('Customer refused text verification. Please use alternative verification method.');
  };

  const handleNoTextCapability = () => {
    console.log('Customer has no text capability');
    alert('Customer has no text capability. Please use alternative verification method.');
  };

  const handleCallAction = (action: string) => {
    console.log('Call action:', action);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30">
        <div className="p-6 space-y-6">
          {/* Customer Detail Panel */}
          <CustomerDetailPanel 
            customer={mockCustomer}
            alerts={mockAlerts}
          />
          
          {/* OTP Panel - Main Content Area */}
          <OTPPanel
            title="One Time Password"
            subtitle="One Time Password - Question And Response"
            tabs={mockOTPTabs}
            alert={mockOTPAlert}
            phoneNumbers={mockPhoneNumbers}
            onTabChange={handleTabChange}
            onSendOTP={handleSendOTP}
            onRefuseText={handleRefuseText}
            onNoTextCapability={handleNoTextCapability}
          />
          
          {/* Call Panel - Active Call */}
          <CallPanel
            callerName="Gweneth Martin"
            callerImage="/images/profile-photo.jpg"
            startTime={new Date(Date.now() - 12000)} // 12 seconds ago
            onMute={() => handleCallAction('mute')}
            onRecord={() => handleCallAction('record')}
            onHangup={() => handleCallAction('hangup')}
            onCall={() => handleCallAction('call')}
          />
        </div>
      </div>
    </Layout>
  );
}