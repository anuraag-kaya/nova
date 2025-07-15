"use client";
import { useState, useRef, useEffect } from "react";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(null); // 'good' or 'bad'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const widgetRef = useRef(null);

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) return;

    setIsSubmitting(true);

    try {
      // Your backend URL
      const API_URL = 'http://localhost:8000/feedback'; // Change this to your actual backend URL
      
      // Prepare the request body matching your backend expectations
      const requestBody = {
        feedback_type: rating, // 'good' or 'bad'
        description: feedback.trim() || "No additional feedback provided" // Changed from 'feedback' to 'description'
      };

      console.log('Sending feedback:', requestBody); // Debug log

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-soeid': 'as03378' // Your required header
        },
        body: JSON.stringify(requestBody)
      });

      // Log response for debugging
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      if (!response.ok) {
        // Parse error details if available
        try {
          const errorData = JSON.parse(responseText);
          console.error('API Error:', errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Parse successful response
      const data = JSON.parse(responseText);
      console.log('Feedback submitted successfully:', data);

      setShowSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setFeedback("");
        setRating(null);
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(`Failed to submit feedback: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button with smooth animations */}
      <div
        ref={widgetRef}
        className={`fixed left-6 bottom-6 z-[100] transition-all duration-300 ${
          isOpen ? "w-80" : "w-auto"
        }`}
      >
        {/* Feedback Form - Opens smoothly */}
        <div
          className={`absolute bottom-16 left-0 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-bottom-left ${
            isOpen 
              ? "scale-100 opacity-100 visible" 
              : "scale-0 opacity-0 invisible"
          }`}
          style={{ width: "320px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0057e7] to-[#0046b8] text-white p-4">
            <h3 className="text-lg font-semibold">
              {showSuccess ? "Thank You! 🎉" : "Share Your Feedback"}
            </h3>
            <p className="text-sm opacity-90 mt-1">
              {showSuccess ? "Your feedback has been received" : "Help us improve ASTRA"}
            </p>
          </div>

          {!showSuccess ? (
            <form onSubmit={handleSubmit} className="p-4">
              {/* Rating Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  How's your experience?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRating('good')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                      rating === 'good'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                      />
                    </svg>
                    <span className="font-medium">Good</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRating('bad')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                      rating === 'bad'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 rotate-180" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                      />
                    </svg>
                    <span className="font-medium">Needs Work</span>
                  </button>
                </div>
              </div>

              {/* Feedback Text Area */}
              <div className="mb-4">
                <label 
                  htmlFor="feedback" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tell us more (optional)
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What can we improve?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0057e7] focus:border-[#0057e7] resize-none transition-all duration-200"
                  rows="3"
                  maxLength="250"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {feedback.length}/250
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!rating || isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  !rating || isSubmitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#0057e7] text-white hover:bg-[#0046b8] shadow-sm hover:shadow-md'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            // Success Message
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-green-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <p className="text-gray-600">
                We appreciate your feedback!
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-gradient-to-r from-[#0057e7] to-[#0046b8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
            isOpen ? 'w-12 h-12' : 'w-14 h-14 hover:scale-110'
          }`}
        >
          {/* Animated Icon */}
          <div className={`transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}>
            {isOpen ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
            )}
          </div>
          
          {/* Tooltip */}
          {!isOpen && isHovered && (
            <span className="absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
              Share Feedback
            </span>
          )}
        </button>
      </div>

      {/* Add smooth animations with CSS */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        .animate-pulse-subtle {
          animation: pulse 2s infinite;
        }
      `}</style>
    </>
  );
}