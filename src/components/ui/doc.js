"use client";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import Notifications from "../studio/components/Notifications";

export default function Documentation() {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // Enhanced notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to Documentation",
      message: "Explore ASTRA's comprehensive documentation and guides",
      date: new Date().toLocaleString(),
      read: false,
      type: "info"
    }
  ]);
  const [unreadNotifications, setUnreadNotifications] = useState(1);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadNotifications(count);
  }, [notifications]);

  // Check authorization
  useEffect(() => {
    if (isLoading) return;

    if (!user?.email) {
      router.push("/api/auth/login");
      return;
    }

    const fetchAccessTokenAndUser = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        if (!tokenRes.ok) throw new Error("Token fetch failed");

        const { accessToken } = await tokenRes.json();

        const userRes = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-user-email": user.email,
            "Content-Type": "application/json",
          },
        });

        if (!userRes.ok) throw new Error("User not authorized");

        setAuthorized(true);
      } catch (error) {
        router.push("/unauthorized");
      }
    };

    fetchAccessTokenAndUser();
  }, [user, isLoading, router]);

  // Notification management functions
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadNotifications(0);
  };

  // Handler for notification clicks
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };
  
  const closeNotifications = () => {
    setShowNotifications(false);
  };

  if (isLoading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0057e7]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  if (error) return <p>Error loading user: {error.message}</p>;

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
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
              onClick={handleNotificationClick}
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
            <Link href="/documentation">
              <div className={`px-5 py-2 text-[15px] font-medium ${
                pathname === "/documentation" 
                  ? "text-[#0057e7] border-b-2 border-[#0057e7]" 
                  : "text-[#0f2d91] hover:text-[#0057e7] border-b-2 border-transparent"
              } transition-colors cursor-pointer`}>
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
          onClose={closeNotifications}
          onClearAll={clearAllNotifications}
          onRemoveNotification={removeNotification}
          onMarkAsRead={markNotificationAsRead}
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
                setDarkMode(!darkMode);
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

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Documentation</h1>
            <p className="text-gray-600 text-lg">
              Welcome to the ASTRA documentation. This section is coming soon.
            </p>
            
            {/* Placeholder content */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
                <p className="text-gray-600 text-sm">Learn the basics of using ASTRA</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="text-lg font-semibold mb-2">API Reference</h3>
                <p className="text-gray-600 text-sm">Detailed API documentation</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-lg font-semibold mb-2">Best Practices</h3>
                <p className="text-gray-600 text-sm">Tips and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#222222] text-white text-center p-2 flex justify-between items-center border-t border-gray-800">
        {/* Left side - Version info */}
        <div className="text-xs text-gray-400 ml-4">
          v0.9.0
        </div>
        
        {/* Centered Powered by Kaya */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-300">Powered by</span>
          <a href="https://kayatech.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="/converted_image.png" alt="Kaya Logo" className="h-3" />
          </a>
        </div>
        
        {/* Right side - Copyright */}
        <div className="text-xs text-gray-400 mr-4">
          © 2025 KAYA Global Inc.
        </div>
      </footer>
    </div>
  );
}