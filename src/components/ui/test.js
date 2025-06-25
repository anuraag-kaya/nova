"use client";
import { useState, useEffect } from 'react';

export default function TableauTest() {
  const [tableauUrl, setTableauUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  // Load saved URL on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('tableauTestUrl');
    if (savedUrl) {
      setTableauUrl(savedUrl);
    }
  }, []);

  const loadDashboard = () => {
    if (!tableauUrl.trim()) {
      setStatus({ message: 'Please enter a Tableau URL', type: 'error' });
      return;
    }

    // Save URL to localStorage
    localStorage.setItem('tableauTestUrl', tableauUrl);

    // Show loading state
    setIsLoading(true);
    setStatus({ message: 'Loading dashboard...', type: 'loading' });
    setShowDashboard(true);

    // Simulate loading complete after 3 seconds
    setTimeout(() => {
      setIsLoading(false);
      setStatus({ 
        message: 'Dashboard loaded! If you see a blank area, check if the URL requires authentication.', 
        type: 'success' 
      });
    }, 3000);
  };

  const clearDashboard = () => {
    setShowDashboard(false);
    setTableauUrl('');
    setStatus({ message: '', type: '' });
    localStorage.removeItem('tableauTestUrl');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loadDashboard();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#333',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          🎯 Tableau Dashboard Test Page
        </h1>

        {/* Instructions */}
        <div style={{
          backgroundColor: '#e7f3ff',
          border: '1px solid #b8daff',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, color: '#004085' }}>📋 Instructions:</h3>
          <ol style={{ paddingLeft: '20px', color: '#004085' }}>
            <li>Get your Tableau embed URL</li>
            <li>Paste it in the input field below</li>
            <li>Click "Load Dashboard" to test if it works</li>
            <li>If successful, you'll see your dashboard below</li>
          </ol>
        </div>

        {/* URL Input Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <label htmlFor="tableauUrl" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#495057'
          }}>
            Tableau Embed URL:
          </label>
          <input
            type="text"
            id="tableauUrl"
            value={tableauUrl}
            onChange={(e) => setTableauUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://your-tableau-server.com/views/YourDashboard/Sheet1?:embed=y&:showVizHome=no"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button
              onClick={loadDashboard}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#0066cc',
                color: 'white',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0052a3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#0066cc'}
            >
              🚀 Load Dashboard
            </button>
            <button
              onClick={clearDashboard}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#dc3545',
                color: 'white',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#b02a37'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Status Message */}
        {status.message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '4px',
            textAlign: 'center',
            fontWeight: 'bold',
            ...(status.type === 'success' && {
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb'
            }),
            ...(status.type === 'error' && {
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb'
            }),
            ...(status.type === 'loading' && {
              backgroundColor: '#d1ecf1',
              color: '#0c5460',
              border: '1px solid #bee5eb'
            })
          }}>
            {status.message}
          </div>
        )}

        {/* Dashboard Container */}
        <div style={{
          width: '100%',
          minHeight: '600px',
          border: showDashboard ? 'none' : '2px dashed #dee2e6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: showDashboard ? 'white' : '#fafafa',
          position: 'relative',
          marginTop: '20px'
        }}>
          {!showDashboard ? (
            <div style={{
              color: '#6c757d',
              fontSize: '18px',
              textAlign: 'center'
            }}>
              Your Tableau dashboard will appear here<br />
              ↑ Enter URL above and click "Load Dashboard"
            </div>
          ) : (
            <iframe
              src={tableauUrl}
              width="100%"
              height="800"
              frameBorder="0"
              style={{
                border: 'none',
                borderRadius: '8px'
              }}
              onLoad={() => {
                setIsLoading(false);
                setStatus({ 
                  message: '✅ Dashboard loaded successfully!', 
                  type: 'success' 
                });
              }}
              onError={() => {
                setIsLoading(false);
                setStatus({ 
                  message: '❌ Error loading dashboard. Please check the URL and your permissions.', 
                  type: 'error' 
                });
              }}
              title="Tableau Dashboard"
            />
          )}
        </div>
      </div>
    </div>
  );
}