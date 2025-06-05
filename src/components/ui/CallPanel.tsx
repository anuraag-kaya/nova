// src/components/ui/CallPanel.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';

export interface CallPanelProps {
  isVisible?: boolean;
  callerName: string;
  callerImage?: string;
  startTime?: Date;
  onMute?: () => void;
  onRecord?: () => void;
  onHangup?: () => void;
  onCall?: () => void;
  className?: string;
}

const CallPanel: React.FC<CallPanelProps> = ({
  isVisible = true,
  callerName,
  callerImage,
  startTime = new Date(),
  onMute,
  onRecord,
  onHangup,
  onCall,
  className = ''
}) => {
  const [duration, setDuration] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update call duration
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Generate sophisticated audio levels
  useEffect(() => {
    const interval = setInterval(() => {
      const newLevels = Array.from({ length: 40 }, (_, i) => {
        const baseLevel = Math.sin(Date.now() * 0.002 + i * 0.3) * 30 + 40;
        const noise = (Math.random() - 0.5) * 20;
        return Math.max(5, Math.min(85, baseLevel + noise));
      });
      setAudioLevels(newLevels);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const handleMute = () => {
    setIsMuted(!isMuted);
    onMute?.();
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    onRecord?.();
  };

  if (!isVisible) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Call Panel */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 animate-pulse"></div>
        
        {/* Content Container */}
        <div className="relative px-8 py-6">
          <div className="flex items-center justify-between">
            
            {/* Left Section - Caller Profile */}
            <div className="flex items-center space-x-6">
              {/* Enhanced Profile Picture */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  {callerImage ? (
                    <Image
                      src={callerImage}
                      alt={callerName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {callerName.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-gray-900 shadow-lg animate-pulse"></div>
              </div>
              
              {/* Caller Info */}
              <div className="space-y-1">
                <h3 className="text-white font-semibold text-xl tracking-tight">{callerName}</h3>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-green-400 font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Connected
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80 font-mono">{duration}</span>
                </div>
              </div>
            </div>

            {/* Center - Audio Visualizer */}
            <div className="flex-1 max-w-md mx-8">
              <div className="flex items-end justify-center space-x-1 h-12">
                {audioLevels.map((level, index) => (
                  <div
                    key={index}
                    className="transition-all duration-100 ease-out"
                    style={{
                      width: '3px',
                      height: `${Math.max(8, level * 0.4)}px`,
                      background: `linear-gradient(to top, ${
                        level > 60 ? '#ef4444' : 
                        level > 30 ? '#f59e0b' : '#10b981'
                      }, ${
                        level > 60 ? '#fca5a5' : 
                        level > 30 ? '#fde68a' : '#6ee7b7'
                      })`,
                      borderRadius: '1.5px',
                      boxShadow: `0 0 8px ${
                        level > 60 ? '#ef444440' : 
                        level > 30 ? '#f59e0b40' : '#10b98140'
                      }`
                    }}
                  ></div>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-white/50 text-xs font-medium">Audio Quality: Excellent</span>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center space-x-3">
              
              {/* Control Buttons */}
              <div className="flex items-center space-x-2">
                
                {/* Mute Button */}
                <button
                  onClick={handleMute}
                  className={`group relative p-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    isMuted 
                      ? 'bg-red-500/20 border border-red-400/30 shadow-lg shadow-red-500/20' 
                      : 'bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isMuted ? (
                    <MicOff className="w-5 h-5 text-red-400 relative z-10" />
                  ) : (
                    <Mic className="w-5 h-5 text-white relative z-10" />
                  )}
                </button>

                {/* Video Button */}
                <button
                  className="group relative p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                  title="Start Video"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Video className="w-5 h-5 text-white relative z-10" />
                </button>

                {/* Record Button */}
                <button
                  onClick={handleRecord}
                  className={`group relative p-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    isRecording 
                      ? 'bg-red-500/20 border border-red-400/30 shadow-lg shadow-red-500/20 animate-pulse' 
                      : 'bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Recording'}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`w-3 h-3 relative z-10 transition-all duration-300 ${
                    isRecording ? 'bg-red-400 rounded-sm' : 'bg-white rounded-full border-2 border-white'
                  }`}></div>
                </button>

                {/* Volume Button */}
                <button
                  className="group relative p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                  title="Volume"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Volume2 className="w-5 h-5 text-white relative z-10" />
                </button>

                {/* More Options */}
                <button
                  className="group relative p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                  title="More Options"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <MoreHorizontal className="w-5 h-5 text-white relative z-10" />
                </button>
              </div>

              {/* Separator */}
              <div className="w-px h-12 bg-white/20"></div>

              {/* Primary Actions */}
              <div className="flex items-center space-x-3">
                
                {/* Call Button */}
                <button
                  onClick={onCall}
                  className="group relative p-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105"
                  title="New Call"
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Phone className="w-5 h-5 text-white relative z-10" />
                </button>

                {/* Hang Up Button */}
                <button
                  onClick={onHangup}
                  className="group relative p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105"
                  title="End Call"
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <PhoneOff className="w-5 h-5 text-white relative z-10" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="border-t border-white/10 bg-white/5 px-8 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-white/70">
              <span>Encryption: End-to-End</span>
              <span>•</span>
              <span>Quality: HD Voice</span>
              <span>•</span>
              <span>Region: Dallas, TX</span>
            </div>
            <div className="text-white/60 font-mono">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallPanel;