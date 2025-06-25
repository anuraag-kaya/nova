"use client";
import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

export default function TableauEmbedTest() {
  const [tableauUrl, setTableauUrl] = useState('https://insights.citigroup.net/t/GCT/views/TMAnalyticalEngine-NAM17344285020630/1-NAMQEFunctionalTestSummary');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const vizContainerRef = useRef(null);

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

    if (!isScriptLoaded) {
      setStatus({ message: 'Tableau API is still loading, please wait...', type: 'error' });
      return;
    }

    // Save URL to localStorage
    localStorage.setItem('tableauTestUrl', tableauUrl);

    // Show loading state
    setStatus({ message: 'Loading dashboard...', type: 'loading' });
    setShowDashboard(true);

    // Clear any existing viz
    if (vizContainerRef.current) {
      vizContainerRef.current.innerHTML = '';
    }

    // Create the tableau-viz element dynamically
    const tableauViz = document.createElement('tableau-viz');
    tableauViz.id = 'tableau-viz';
    tableauViz.setAttribute('src', tableauUrl);
    tableauViz.setAttribute('width', '100%');
    tableauViz.setAttribute('height', '800');
    tableauViz.setAttribute('toolbar', 'bottom');
    
    // Add event listeners
    tableauViz.addEventListener('firstinteractive', () => {
      setStatus({ 
        message: '✅ Dashboard loaded successfully!', 
        type: 'success' 
      });
    });

    tableauViz.addEventListener('vizloaderror', (e) => {
      console.error('Tableau loading error:', e);
      setStatus({ 
        message: '❌ Error loading dashboard. Check console for details.', 
        type: 'error' 
      });
    });

    // Append to container
    if (vizContainerRef.current) {
      vizContainerRef.current.appendChild(tableauViz);
    }
  };

  const clearDashboard = () => {
    setShowDashboard(false);
    setTableauUrl('');
    setStatus({ message: '', type: '' });
    localStorage.removeItem('tableauTestUrl');
    
    // Clear the viz container
    if (vizContainerRef.current) {
      vizContainerRef.current.innerHTML = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loadDashboard();
    }
  };

  return (
    <>
      {/* Load Tableau Embedding API v3 */}
      <Script
        src="https://insights.citigroup.net/javascripts/api/tableau.embedding.3.latest.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Tableau Embedding API loaded');
          setIsScriptLoaded(true);
          setStatus({ message: '✅ Tableau API loaded successfully', type: 'success' });
        }}
        onError={(e) => {
          console.error('Failed to load Tableau API:', e);
          setStatus({ 
            message: '❌ Failed to load Tableau API. Check if you have access to insights.citigroup.net', 
            type: 'error' 
          });
        }}
      />

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
            🎯 Tableau Embedding API v3 Test
          </h1>

          {/* API Status */}
          <div style={{
            backgroundColor: isScriptLoaded ? '#d4edda' : '#f8d7da',
            border: `1px solid ${isScriptLoaded ? '#c3e6cb' : '#f5c6cb'}`,
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Tableau API Status: {isScriptLoaded ? '✅ Loaded' : '⏳ Loading...'}
          </div>

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
              <li>This uses Tableau Embedding API v3 (not iframe)</li>
              <li>Make sure you're logged into insights.citigroup.net</li>
              <li>The default URL is your TMAnalyticalEngine dashboard</li>
              <li>Click "Load Dashboard" to test</li>
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
              Tableau Dashboard URL:
            </label>
            <input
              type="text"
              id="tableauUrl"
              value={tableauUrl}
              onChange={(e) => setTableauUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://insights.citigroup.net/t/GCT/views/..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'monospace'
              }}
            />

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button
                onClick={loadDashboard}
                disabled={!isScriptLoaded}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isScriptLoaded ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: isScriptLoaded ? '#0066cc' : '#6c757d',
                  color: 'white',
                  transition: 'all 0.3s',
                  opacity: isScriptLoaded ? 1 : 0.6
                }}
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
              <div ref={vizContainerRef} style={{ width: '100%', height: '100%' }}>
                {/* Tableau viz will be inserted here dynamically */}
              </div>
            )}
          </div>

          {/* Troubleshooting Tips */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px'
          }}>
            <h4 style={{ marginTop: 0, color: '#856404' }}>🔧 Troubleshooting:</h4>
            <ul style={{ marginBottom: 0, color: '#856404' }}>
              <li>If you see "refused to connect", make sure you're logged into insights.citigroup.net</li>
              <li>Check if your browser allows mixed content (if using HTTPS)</li>
              <li>Verify you have permissions to view the dashboard</li>
              <li>Try opening the dashboard URL directly in a new tab first</li>
              <li>Check browser console (F12) for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}