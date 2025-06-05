// src/data/mockData.ts

import { Customer, AccountAlert, Card, SidebarSection, ActivityItem } from '@/types';
import { MiddlePanelTab, MiddlePanelAlert, MiddlePanelColumn, MiddlePanelRow } from '@/components/ui/MiddlePanel';

export const mockCustomer: Customer = {
  primaryName: 'THOMAS MARTIN',
  preferredName: 'TOM',
  communicatingWith: 'GWENETH MARTIN',
  relationship: 'PRIMARY',
  language: 'ENGLISH',
  timezone: 'EST'
};

export const mockAlerts: AccountAlert[] = [
  {
    id: '1',
    type: 'info',
    title: 'Tropical Storm Helene',
    isRead: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Verify Address',
    isRead: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Customer Traveling To England',
    isRead: false
  },
  {
    id: '4',
    type: 'error',
    title: 'Currently Has Dispute Under Investigation',
    isRead: false
  }
];

export const mockCards: Card[] = [
  {
    id: '1',
    name: 'Thomas Martin',
    relationship: 'Primary',
    mailDescription: 'Regular Mail',
    cardType: 'Photo',
    zipCode: '90215',
    paymentDevice: '',
    issueDate: '07/21/06',
    mailDate: '07/22/06',
    destroyDate: ''
  },
  {
    id: '2',
    name: 'Gwyneth Martin',
    relationship: 'Joint',
    mailDescription: 'Regular Mail',
    cardType: 'Photo',
    zipCode: '41203',
    paymentDevice: 'Chip Card',
    issueDate: '07/21/06',
    mailDate: '07/22/06',
    destroyDate: ''
  },
  {
    id: '3',
    name: 'Joseph Martin',
    relationship: 'Auth. User',
    mailDescription: 'Regular Mail',
    cardType: 'Photo',
    zipCode: '07321',
    paymentDevice: '',
    issueDate: '07/21/06',
    mailDate: '07/22/06',
    destroyDate: '07/01/06'
  }
];

export const mockSidebarSections: SidebarSection[] = [
  {
    id: 'services',
    title: 'Services / Favorites',
    isExpanded: true,
    items: [
      {
        id: 'account-billing',
        label: 'Account / Billing',
        href: '/account',
        isActive: false
      },
      {
        id: 'cards',
        label: 'Cards',
        href: '/cards',
        isActive: false
      },
      {
        id: 'case-management',
        label: 'Case Management',
        href: '/cases',
        isActive: false
      },
      {
        id: 'checks-bi',
        label: 'Checks / BI',
        href: '/checks',
        isActive: false
      },
      {
        id: 'customer-details',
        label: 'Customer Details',
        href: '/customer-details',
        isActive: false
      },
      {
        id: 'offers-features',
        label: 'Offers / Features',
        href: '/offers',
        isActive: false
      }
    ]
  }
];

export const mockActivityItems: ActivityItem[] = [
  {
    id: '1',
    title: 'Process Name Completed',
    date: 'Tuesday, 28 May 2024',
    status: 'completed',
    type: 'process'
  },
  {
    id: '2',
    title: 'Process Name',
    date: 'Tuesday, 28 May 2024',
    status: 'in-progress',
    type: 'process'
  },
  {
    id: '3',
    title: 'Process Name Next',
    date: 'Tuesday, 28 May 2024',
    status: 'pending',
    type: 'process'
  }
];

// New Offers Data
export const mockOffers = [
  {
    id: 'cp-new-balance',
    label: 'CP - $0.85/$100 New Balance',
    href: '/offers/cp-new-balance'
  },
  {
    id: 'add-account',
    label: 'Add an Account',
    href: '/offers/add-account'
  },
  {
    id: 'identity-monitor',
    label: 'Identity Monitor',
    href: '/offers/identity-monitor'
  },
  {
    id: 'credit-line-increase',
    label: 'Credit Line Increase',
    href: '/offers/credit-line-increase'
  }
];

// OTP Panel Data
export const mockOTPTabs: MiddlePanelTab[] = [
  { id: 'summary', label: 'Summary', isActive: true },
  { id: 'customer', label: 'Customer' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'history', label: 'History' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'sales', label: 'Sales' }
];

export const mockOTPAlert: MiddlePanelAlert = {
  id: 'otp-security-alert',
  type: 'info',
  title: 'Inform the customer, before we can proceed you need to perform additional security verification.',
  message: 'Does the customer have a cell phone readily available that can receive a text message? Inform the customer normal cell phone charges apply.',
  isVisible: true
};

export const mockPhoneNumbers = [
  {
    id: 'home',
    type: 'Home Phone Number',
    number: '(941) 987-6543',
    canSend: true
  },
  {
    id: 'business',
    type: 'Business Phone Number',
    number: '(941) 987-6544',
    canSend: true
  },
  {
    id: 'cell',
    type: 'Cell Phone Number',
    number: '(941) 987-6545',
    canSend: true
  },
  {
    id: 'other',
    type: 'Other Phone Number',
    number: '',
    canSend: true
  }
];

// Middle Panel Mock Data (keeping existing for other pages)
export const mockMiddlePanelTabs: MiddlePanelTab[] = [
  { id: 'summary', label: 'Summary', isActive: true },
  { id: 'customer', label: 'Customer' },
  { id: 'accounts', label: 'Accounts', badge: 3 },
  { id: 'history', label: 'History' },
  { id: 'transactions', label: 'Transactions', badge: 12 },
  { id: 'sales', label: 'Sales' }
];

export const mockMiddlePanelAlert: MiddlePanelAlert = {
  id: 'card-activation-alert',
  type: 'info',
  title: 'The account was recently mailed 2 plastics/devices on 7/22/2006',
  message: 'Ask the Cardmember to confirm the number of cards and/or payment tags they have received. If the Cardmember has not received cards not listed on this screen, continue the activation process. If the Cardmember has not received all cards mailed, select the All not Received option.',
  isVisible: true
};

export const mockMiddlePanelColumns: MiddlePanelColumn[] = [
  { id: 'name', label: 'NAME', sortable: true, width: '15%' },
  { id: 'relationship', label: 'RELATIONSHIP', sortable: true, width: '12%' },
  { id: 'mailDescription', label: 'MAIL DESCRIPTION', sortable: true, width: '15%' },
  { id: 'cardType', label: 'CARD TYPE', sortable: true, width: '10%' },
  { id: 'zipCode', label: 'ZIP CODE', sortable: true, width: '10%' },
  { id: 'paymentDevice', label: 'PAYMENT DEVICE', sortable: true, width: '12%' },
  { id: 'issueDate', label: 'ISSUE DATE', sortable: true, width: '10%' },
  { id: 'mailDate', label: 'MAIL DATE', sortable: true, width: '10%' },
  { id: 'destroyDate', label: 'DESTROY DATE', sortable: true, width: '10%' }
];

export const mockMiddlePanelData: MiddlePanelRow[] = [
  {
    id: '1',
    name: 'Thomas Martin',
    relationship: 'Primary',
    mailDescription: 'Regular Mail',
    cardType: 'Photo',
    zipCode: '90215',
    paymentDevice: '',
    issueDate: '07/21/06',
    mailDate: '07/22/06',
    destroyDate: ''
  },
  {
    id: '2',
    name: 'Gwyneth Martin',
    relationship: 'Joint',
    mailDescription: 'Regular Mail',
    cardType: 'Photo',
    zipCode: '41203',
    paymentDevice: 'Chip Card',
    issueDate: '07/21/06',
    mailDate: '07/22/06',
    destroyDate: ''
  },
  {
    id: '3',
    name: 'Joseph Martin',
    relationship: 'Auth. User',
    mailDescription: 'Regular Mail',
    cardType: 'Photo',
    zipCode: '07321',
    paymentDevice: '',
    issueDate: '07/21/06',
    mailDate: '07/22/06',
    destroyDate: '07/01/06'
  }
];