"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState("chat-1");
  const [isHovered, setIsHovered] = useState(false);
  const widgetRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Dummy chat history data
  const [chatHistory] = useState([
    {
      id: "chat-1",
      title: "Test Case Generation Help",
      timestamp: "2 hours ago",
      preview: "How can I generate test cases for..."
    },
    {
      id: "chat-2", 
      title: "ASTRA Dashboard Questions",
      timestamp: "Yesterday",
      preview: "Can you explain the analytics..."
    },
    {
      id: "chat-3",
      title: "User Story Management",
      timestamp: "3 days ago", 
      preview: "What's the best way to organize..."
    },
    {
      id: "chat-4",
      title: "Integration Guidelines",
      timestamp: "1 week ago",
      preview: "I need help with API integration..."
    },
    {
      id: "chat-5",
      title: "Reporting Features",
      timestamp: "2 weeks ago",
      preview: "How do I create custom reports..."
    }
  ]);

  // Current chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Hello! I'm your ASTRA AI assistant. I can help you with test case generation, user story management, analytics, and any questions about the platform. How can I assist you today?",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 2,
      type: "user", 
      content: "How can I generate test cases for my user stories?",
      timestamp: new Date(Date.now() - 3000000).toISOString()
    },
    {
      id: 3,
      type: "ai",
      content: "Great question! In ASTRA, you can generate test cases in several ways:\n\n1. **Select a User Story** in the Studio page\n2. **Click the Generate button** in the toolbar\n3. **Choose your LLM model** (GPT-4, Gemini, etc.)\n4. **Add a custom prompt** if needed\n5. **Click Generate Test Cases**\n\nThe AI will automatically create comprehensive test cases based on your user story details. You can also regenerate specific test cases if needed. Would you like me to walk you through any specific part of this process?",
      timestamp: new Date(Date.now() - 2400000).toISOString()
    }
  ]);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai", 
        content: getAIResponse(userMessage.content),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  // Simple AI response simulator
  const getAIResponse = (userInput) => {
    const responses = [
      "I'd be happy to help you with that! Could you provide more specific details about what you're trying to accomplish?",
      "That's a great question! In ASTRA, you can achieve this through the Studio interface. Let me guide you through the process...",
      "Based on your question, I recommend checking the Analytics dashboard for detailed insights. You can also use the AI-powered test generation features.",
      "For optimal results with ASTRA, I suggest following these best practices:\n\n1. Start with clear user stories\n2. Use specific acceptance criteria\n3. Leverage the AI generation tools\n4. Review and refine generated content",
      "I understand you're looking for guidance on this feature. The ASTRA platform offers several approaches to handle this scenario effectively."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Handle key press in textarea
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Start new chat
  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    setCurrentChatId(newChatId);
    setMessages([
      {
        id: 1,
        type: "ai",
        content: "Hello! I'm your ASTRA AI assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <>
      {/* Main Chat Modal */}
      <div
        ref={widgetRef}
        className={`fixed right-6 bottom-20 z-[100] transition-all duration-500 ease-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500 transform ${
            isOpen 
              ? "scale-100 translate-y-0" 
              : "scale-95 translate-y-4"
          }`}
          style={{ 
            width: "62vw", 
            height: "75vh",
            maxWidth: "1000px",
            minWidth: "800px",
            maxHeight: "600px",
            minHeight: "500px"
          }}
        >
          <div className="flex h-full">
            {/* Sidebar */}
            <div className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col ${
              isSidebarOpen ? "w-72" : "w-0"
            } overflow-hidden`}>
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <button
                  onClick={handleNewChat}
                  className="w-full bg-[#0057e7] text-white rounded-lg py-2.5 px-4 hover:bg-[#0046b8] transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Chat
                </button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Recent Chats</h3>
                  {chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setCurrentChatId(chat.id)}
                      className={`w-full text-left p-3 rounded-lg mb-1 transition-colors duration-200 group ${
                        currentChatId === chat.id 
                          ? "bg-[#0057e7] text-white" 
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium text-sm truncate mb-1">{chat.title}</div>
                      <div className={`text-xs truncate ${
                        currentChatId === chat.id ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {chat.preview}
                      </div>
                      <div className={`text-xs mt-1 ${
                        currentChatId === chat.id ? "text-blue-200" : "text-gray-400"
                      }`}>
                        {chat.timestamp}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#0057e7] to-[#0046b8] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">ASTRA AI Assistant</h2>
                      <p className="text-sm text-gray-500">Always here to help</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.type === 'user'
                          ? 'bg-[#0057e7] text-white ml-4'
                          : 'bg-white text-gray-900 border border-gray-200 mr-4'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 px-1 ${
                        msg.type === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.type === 'user' 
                        ? 'bg-[#0057e7] order-1 ml-3' 
                        : 'bg-gradient-to-br from-[#0057e7] to-[#0046b8] order-2 mr-3'
                    }`}>
                      {msg.type === 'user' ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#0057e7] to-[#0046b8] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 bg-white p-4">
                <form onSubmit={handleSubmit} className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about ASTRA..."
                      className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0057e7] focus:border-[#0057e7] transition-all duration-200"
                      rows={1}
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!message.trim() || isTyping}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      message.trim() && !isTyping
                        ? 'bg-[#0057e7] hover:bg-[#0046b8] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isTyping ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-gradient-to-r from-[#0057e7] to-[#0046b8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
            isOpen ? 'w-14 h-14' : 'w-14 h-14 hover:scale-110'
          }`}
        >
          {/* Animated Icon */}
          <div className={`transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            )}
          </div>
          
          {/* Tooltip */}
          {!isOpen && isHovered && (
            <span className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
              Chat with ASTRA AI
            </span>
          )}
        </button>
      </div>
    </>
  );
}