// app/components/Header.js
"use client";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import Notifications from "../studio/components/Notifications";

export default function Header({ 
  darkMode = false, 
  notifications = [], 
  onNotificationUpdate,
  showNotifications = false,
  onToggleNotifications,
  onCloseNotifications,
  onClearAllNotifications,
  onRemoveNotification,
  onMarkAsRead,
  unreadNotifications = 0
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <>
      {/* Header */}
      <header className={`flex justify-between items-center px-4 py-2 h-20 shadow-md ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}>
        {/* Logo */}
        <div className="flex items-center ml-5">
          {darkMode ? (
            <div className="flex items-center">
              <img 
                src="/citi-logo-dark.png" 
                alt="Citi" 
                className="h-8 w-auto" 
              />
              <span className="ml-5 text-[28px] font-medium text-white font-roboto flex items-center mt-[9px]">
                ASTRA
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <img 
                src="/citi-logo.png" 
                alt="Citi" 
                className="h-8 w-auto" 
              />
              <span className="ml-5 text-[26px] font-medium text-black font-roboto flex items-center mt-[10px]">
                ASTRA
              </span>
            </div>
          )}
        </div>

        {/* Header Buttons */}
        <div className="flex items-center space-x-3">
          {/* Notification Icon with badge */}
          <div className="relative">
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={onToggleNotifications}
            >
              <Image src="/notification-icon.png" alt="Notifications" width={24} height={24} />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-[#d62d20] rounded-full text-white text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center text-white font-medium">
              {user?.name ? 
                user.name.split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase() 
                : 'A'}
            </div>
          </button>
        </div>
      </header>

      {/* Menu Bar with active state highlighting */}
      <div className="bg-[#f0f5f7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.07)] relative z-10 border-b border-gray-200">
        <div className="pl-4">
          <nav className="flex h-10">
            <Link href="/">
              <div className={`px-5 py-2 text-[15px] font-medium ${
                pathname === "/" 
                  ? "text-[#0057e7] border-b-2 border-[#0057e7]" 
                  : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"
                } transition-colors cursor-pointer`}>
                Home
              </div>
            </Link>
            <Link href="/studio">
              <div className={`px-5 py-2 text-[15px] font-medium ${
                pathname === "/studio" 
                  ? "text-[#0057e7] border-b-2 border-[#0057e7]" 
                  : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"
                } transition-colors cursor-pointer`}>
                Studio
              </div>
            </Link>
            <Link href="/analytics">
              <div className={`px-5 py-2 text-[15px] font-medium ${
                pathname === "/analytics" 
                  ? "text-[#0057e7] border-b-2 border-[#0057e7]" 
                  : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"
                } transition-colors cursor-pointer`}>
                Analytics
              </div>
            </Link>
            <Link href="#">
              <div className="px-5 py-2 text-[15px] font-medium text-gray-400 border-b-2 border-transparent cursor-not-allowed">
                Documentation
              </div>
            </Link>
          </nav>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <Notifications 
          notifications={notifications}
          onClose={onCloseNotifications}
          onClearAll={onClearAllNotifications}
          onRemoveNotification={onRemoveNotification}
          onMarkAsRead={onMarkAsRead}
        />
      )}

      {/* Profile Menu */}
      {showProfileMenu && (
        <div 
          className="fixed right-4 top-12 w-48 bg-white shadow-xl rounded-md z-50 border border-gray-200 overflow-hidden"
          style={{ position: 'absolute', top: '60px', right: '10px' }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>👤</span> <h1>{user?.name || "Guest"}</h1>
            </button>
            <Link href="/settings">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <span>⚙️</span> Settings
              </button>
            </Link>
            <button
              onClick={() => {
                if (onNotificationUpdate) {
                  onNotificationUpdate('toggleDarkMode', !darkMode);
                }
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>{darkMode ? "☀️" : "🌙"}</span> {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => {
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <span>❓</span> Help & Support
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              onClick={() => {
                setShowProfileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#d62d20] hover:bg-[#d62d20]/10 flex items-center gap-2 transition-colors"
            >
              <span>🚪</span><a href="/api/auth/logout"> Sign out</a>
            </button>
          </div>
        </div>
      )}

      {/* Overlay to catch clicks outside the profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setShowProfileMenu(false)}
          style={{ cursor: 'default' }}
        ></div>
      )}
    </>
  );
}