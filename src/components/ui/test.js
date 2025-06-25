"use client";
import { useState, useEffect, useRef } from 'react';

export default function TableauEmbedWorking() {
  const [tableauUrl, setTableauUrl] = useState('https://insights.citigroup.net/t/GCT/views/TMAnalyticalEngine-NAM17344285020630/1-NAMQEFunctionalTestSummary');
  const [showDashboard, setShowDashboard] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [currentMethod, setCurrentMethod] = useState('');
  const containerRef = useRef(null);

  // Test Methods to try different approaches
  const testMethods = [
    {
      name: 'Method 1: Direct Embed',
      description: 'Using tableau-viz web component directly',
      action: 'embed'
    },
    {
      name: 'Method 2: JavaScript API v2',
      description: 'Using older Tableau JavaScript API',
      action: 'jsapi'
    },
    {
      name: 'Method 3: Trusted Ticket',
      description: 'Using trusted authentication',
      action: 'trusted'
    },
    {
      name: 'Method 4: Simple iFrame',
      description: 'Basic iframe with parameters',
      action: 'iframe'
    }
  ];

  const clearContainer = () => {
    if (containerRef.current) {
      // Safely clear the container
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    }
  };

  const loadDashboardWithMethod = (method) => {
    // Clear any previous content first
    clearContainer();
    
    setShowDashboard(true);
    setCurrentMethod(method);
    setStatus({ message: `Loading with ${method}...`, type: 'loading' });

    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      const container = containerRef.current;
      if (!container) {
        setStatus({ message: 'Container not found', type: 'error' });
        return;
      }

      try {
        switch(method) {
          case 'embed':
            // Method 1: Create elements dynamically instead of innerHTML
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://insights.citigroup.net/javascripts/api/tableau.embedding.3.latest.min.js';
            
            const tableauViz = document.createElement('tableau-viz');
            tableauViz.setAttribute('id', 'tableauViz');
            tableauViz.setAttribute('src', tableauUrl);
            tableauViz.setAttribute('width', '100%');
            tableauViz.setAttribute('height', '800');
            tableauViz.setAttribute('hide-tabs', 'true');
            tableauViz.setAttribute('toolbar', 'bottom');
            tableauViz.setAttribute('device', 'desktop');
            
            container.appendChild(script);
            container.appendChild(tableauViz);
            
            // Listen for events
            tableauViz.addEventListener('firstinteractive', () => {
              setStatus({ message: '✅ Dashboard loaded successfully!', type: 'success' });
            });
            
            tableauViz.addEventListener('vizloaderror', (e) => {
              console.error('Tableau error:', e);
              setStatus({ message: '❌ Error loading dashboard', type: 'error' });
            });
            break;

          case 'jsapi':
            // Method 2: JavaScript API v2
            const jsApiScript = document.createElement('script');
            jsApiScript.src = 'https://insights.citigroup.net/javascripts/api/viz_v1.js';
            jsApiScript.onload = () => {
              const vizDiv = document.createElement('div');
              vizDiv.id = 'vizContainer2';
              vizDiv.style.width = '100%';
              vizDiv.style.height = '800px';
              container.appendChild(vizDiv);
              
              // Initialize after script loads
              if (window.tableau) {
                try {
                  const options = {
                    hideTabs: true,
                    hideToolbar: false,
                    width: "100%",
                    height: "800px",
                    onFirstInteractive: function () {
                      setStatus({ message: '✅ Dashboard loaded successfully!', type: 'success' });
                    }
                  };
                  new window.tableau.Viz(vizDiv, tableauUrl, options);
                } catch(e) {
                  console.error("Error with Tableau JS API:", e);
                  setStatus({ message: '❌ Error with JS API', type: 'error' });
                }
              }
            };
            container.appendChild(jsApiScript);
            break;

          case 'trusted':
            // Method 3: Trusted ticket approach
            const trustedIframe = document.createElement('iframe');
            trustedIframe.src = `${tableauUrl}?:embed=yes&:comments=no&:toolbar=yes&:refresh=yes`;
            trustedIframe.width = '100%';
            trustedIframe.height = '800';
            trustedIframe.frameBorder = '0';
            trustedIframe.setAttribute('allowfullscreen', 'true');
            
            trustedIframe.onload = () => {
              setStatus({ message: 'iFrame loaded. If blank, authentication may be required.', type: 'info' });
            };
            
            trustedIframe.onerror = () => {
              setStatus({ message: '❌ Error loading iframe', type: 'error' });
            };
            
            container.appendChild(trustedIframe);
            break;

          case 'iframe':
            // Method 4: Simple iframe with all parameters
            const simpleIframe = document.createElement('iframe');
            const iframeUrl = tableauUrl + 
              '?:embed=y' +
              '&:showVizHome=no' +
              '&:host_url=https%3A%2F%2Finsights.citigroup.net%2F' +
              '&:embed_code_version=3' +
              '&:tabs=no' +
              '&:toolbar=yes' +
              '&:animate_transition=yes' +
              '&:display_static_image=yes' +
              '&:display_spinner=yes' +
              '&:display_overlay=yes' +
              '&:display_count=yes' +
              '&:language=en-US' +
              '&:loadOrderID=0';
            
            simpleIframe.src = iframeUrl;
            simpleIframe.width = '100%';
            simpleIframe.height = '800';
            simpleIframe.frameBorder = '0';
            simpleIframe.scrolling = 'no';
            simpleIframe.setAttribute('allowfullscreen', 'true');
            
            simpleIframe.onload = () => {
              setStatus({ message: 'iFrame loaded. If blank, check console for CORS errors.', type: 'info' });
            };
            
            simpleIframe.onerror = () => {
              setStatus({ message: '❌ Error loading iframe', type: 'error' });
            };
            
            container.appendChild(simpleIframe);
            break;

          default:
            setStatus({ message: 'Unknown method', type: 'error' });
        }
      } catch (error) {
        console.error('Error in loadDashboardWithMethod:', error);
        setStatus({ message: `Error: ${error.message}`, type: 'error' });
      }
    }, 100);

    // Check status after 5 seconds
    setTimeout(() => {
      if (status.type === 'loading') {
        setStatus({ 
          message: 'Still loading... Check browser console (F12) for errors', 
          type: 'info' 
        });
      }
    }, 5000);
  };

  const openInNewTab = () => {
    window.open(tableauUrl, '_blank');
  };

  const clearDashboard = () => {
    clearContainer();
    setShowDashboard(false);
    setCurrentMethod('');
    setStatus({ message: '', type: '' });
  };

  // Test direct embed in a popup window
  const testInPopup = () => {
    const popupHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tableau Test</title>
        <script type='module' src='https://insights.citigroup.net/javascripts/api/tableau.embedding.3.latest.min.js'></script>
      </head>
      <body>
        <h1>Tableau Popup Test</h1>
        <tableau-viz 
          src='${tableauUrl}'
          width='1200' 
          height='800'>
        </tableau-viz>
      </body>
      </html>
    `;
    
    const popup = window.open('', 'tableauTest', 'width=1300,height=900');
    popup.document.write(popupHtml);
    popup.document.close();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🔧 Tableau Embedding Test (Fixed)</h1>
      
      {/* Step 1: Verify Access */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h2>Step 1: Verify Direct Access ✅</h2>
        <p style={{ color: 'green' }}>✓ You confirmed the dashboard opens in a new tab!</p>
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={openInNewTab}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            📂 Open Dashboard in New Tab (Working)
          </button>
          <button
            onClick={testInPopup}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔲 Test in Popup Window
          </button>
        </div>
      </div>

      {/* Step 2: Try Different Methods */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h2>Step 2: Try Embedding Methods (Fixed DOM Error)</h2>
        <p>URL: <code style={{ backgroundColor: '#e9ecef', padding: '2px 4px', fontSize: '12px', wordBreak: 'break-all' }}>{tableauUrl}</code></p>
        
        <div style={{ marginTop: '15px' }}>
          {testMethods.map((method, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => loadDashboardWithMethod(method.action)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentMethod === method.action ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  minWidth: '200px'
                }}
              >
                {method.name}
              </button>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {method.description}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={clearDashboard}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          🗑️ Clear Dashboard
        </button>
      </div>

      {/* Status Message */}
      {status.message && (
        <div style={{
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          backgroundColor: 
            status.type === 'success' ? '#d4edda' :
            status.type === 'error' ? '#f8d7da' :
            status.type === 'loading' ? '#d1ecf1' :
            '#d1ecf1',
          color:
            status.type === 'success' ? '#155724' :
            status.type === 'error' ? '#721c24' :
            status.type === 'loading' ? '#0c5460' :
            '#0c5460',
          border: `1px solid ${
            status.type === 'success' ? '#c3e6cb' :
            status.type === 'error' ? '#f5c6cb' :
            status.type === 'loading' ? '#bee5eb' :
            '#bee5eb'
          }`
        }}>
          {status.message}
        </div>
      )}

      {/* Dashboard Container */}
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          minHeight: showDashboard ? '820px' : '200px',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          padding: showDashboard ? '10px' : '20px',
          backgroundColor: '#fafafa',
          display: showDashboard ? 'block' : 'flex',
          alignItems: showDashboard ? 'stretch' : 'center',
          justifyContent: showDashboard ? 'flex-start' : 'center',
          overflow: 'hidden'
        }}
      >
        {!showDashboard && (
          <div style={{ textAlign: 'center', color: '#6c757d' }}>
            Dashboard will appear here after clicking a method above
          </div>
        )}
      </div>

      {/* What's Happening */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        border: '1px solid #b8daff',
        borderRadius: '4px'
      }}>
        <h3>🔍 What's Happening?</h3>
        <p>Since the dashboard opens in a new tab, the issue is likely:</p>
        <ul>
          <li><strong>X-Frame-Options:</strong> The Tableau server is blocking embedding in iframes</li>
          <li><strong>CORS Policy:</strong> Cross-origin requests are being blocked</li>
          <li><strong>Same-Origin Policy:</strong> localhost is not trusted by the server</li>
        </ul>
        
        <h4>✅ Solution:</h4>
        <p>You need to configure Tableau Server to allow embedding from localhost. Contact your Tableau admin to:</p>
        <ol>
          <li>Add <code>localhost:3000</code> to the allowed embedding domains</li>
          <li>Or enable "Unrestricted embedding" for development</li>
          <li>Or use Tableau Connected Apps with JWT authentication</li>
        </ol>
      </div>
    </div>
  );
}