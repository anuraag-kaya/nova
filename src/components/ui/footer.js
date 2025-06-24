// app/components/Footer.js
"use client";

export default function Footer() {
  return (
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
  );
}