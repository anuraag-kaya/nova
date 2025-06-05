// src/app/activate/page.tsx

"use client";

import Layout from '../../../components/layout/layout';
import CustomerDetailPanel from '@/components/ui/CustomerDetailPanel';
import MiddlePanel from '@/components/ui/MiddlePanel';
import CallPanel from '@/components/ui/CallPanel';
import { 
  mockCustomer, 
  mockAlerts, 
  mockMiddlePanelTabs,
  mockMiddlePanelAlert,
  mockMiddlePanelColumns,
  mockMiddlePanelData
} from '@/data/mockData';

export default function ActivatePage() {
  const handleTabChange = (tabId: string) => {
    console.log('Tab changed to:', tabId);
  };

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'activate':
        alert('Cards activated successfully!');
        break;
      case 'all-not-received':
        alert('All Not Received option selected');
        break;
      case 'cancel':
        alert('Activation cancelled');
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  const handleCallAction = (action: string) => {
    console.log('Call action:', action);
  };

  const actions = [
    {
      id: 'activate',
      label: 'ACTIVATE',
      variant: 'primary' as const
    },
    {
      id: 'all-not-received',
      label: 'ALL NOT RECEIVED',
      variant: 'primary' as const
    },
    {
      id: 'cancel',
      label: 'CANCEL',
      variant: 'outline' as const
    }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Customer Detail Panel */}
        <CustomerDetailPanel 
          customer={mockCustomer}
          alerts={mockAlerts}
        />
        
        {/* Middle Panel - Card Activation Content */}
        <MiddlePanel
          title="Activate Cards/Device And Checks"
          subtitle="Cards / Devices Mailed"
          tabs={mockMiddlePanelTabs}
          alert={mockMiddlePanelAlert}
          columns={mockMiddlePanelColumns}
          data={mockMiddlePanelData}
          actions={actions}
          onTabChange={handleTabChange}
          onActionClick={handleActionClick}
        />
        
        {/* Call Panel - Active Call */}
        <CallPanel
          callerName="Gweneth Martin"
          callerImage="/images/profile-photo.jpg"
          startTime={new Date(Date.now() - 8000)} // 8 seconds ago
          onMute={() => handleCallAction('mute')}
          onRecord={() => handleCallAction('record')}
          onHangup={() => handleCallAction('hangup')}
          onCall={() => handleCallAction('call')}
        />
      </div>
    </Layout>
  );
}