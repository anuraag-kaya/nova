// src/types/index.ts

export interface Customer {
    primaryName: string;
    preferredName: string;
    communicatingWith: string;
    relationship: 'PRIMARY' | 'JOINT' | 'AUTHORIZED';
    language: 'ENGLISH' | 'SPANISH' | 'FRENCH';
    timezone: 'EST' | 'PST' | 'CST' | 'MST';
  }
  
  export interface AccountAlert {
    id: string;
    type: 'warning' | 'info' | 'error';
    title: string;
    description?: string;
    isRead: boolean;
  }
  
  export interface Card {
    id: string;
    name: string;
    relationship: 'Primary' | 'Joint' | 'Auth. User';
    mailDescription: string;
    cardType: string;
    zipCode: string;
    paymentDevice?: string;
    issueDate: string;
    mailDate: string;
    destroyDate?: string;
  }
  
  export interface HeaderProps {
    customer: Customer;
    alerts: AccountAlert[];
    className?: string;
  }
  
  export interface SidebarNavItem {
    id: string;
    label: string;
    href: string;
    icon?: string;
    isActive?: boolean;
    children?: SidebarNavItem[];
  }
  
  export interface SidebarSection {
    id: string;
    title: string;
    items: SidebarNavItem[];
    isExpanded?: boolean;
  }
  
  export interface ActivityItem {
    id: string;
    title: string;
    date: string;
    status: 'completed' | 'in-progress' | 'pending';
    type: 'process' | 'task' | 'notification';
  }
  
  export interface SidebarProps {
    className?: string;
  }