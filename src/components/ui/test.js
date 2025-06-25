"use client";
import { useState, useEffect } from 'react';

export default function TableauEmbedFixed() {
  const [tableauUrl, setTableauUrl] = useState('https://insights.citigroup.net/t/GCT/views/TMAnalyticalEngine-NAM17344285020630/1-NAMQEFunctionalTestSummary');
  const [showDashboard, setShowDashboard] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [authMethod, setAuthMethod] = useState('trusted'); // 'trusted' or 'public'

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

  const loadDashboardWithMethod = (method) => {
    setShowDashboard(true);
    setStatus({ message: `Trying ${method}...`, type: 'loading' });

    const container = document.getElementById('vizContainer');
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    switch(method) {
      case 'embed':
        // Method 1: Direct tableau-viz embed
        container.innerHTML = `
          <script type='module' src='https://insights.citigroup.net/javascripts/api/tableau.embedding.3.latest.min.js'></script>
          <tableau-viz 
            id='tableauViz' 
            src='${tableauUrl}'
            width='100%' 
            height='800'
            hide-tabs='true'
            toolbar='bottom'
            device='desktop'>
          </tableau-viz>
        `;
        break;

      case 'jsapi':
        // Method 2: JavaScript API v2
        container.innerHTML = `
          <script type='text/javascript' src='https://insights.citigroup.net/javascripts/api/viz_v1.js'></script>
          <div id='vizContainer2' style='width:100%; height:800px;'></div>
          <script type='text/javascript'>
            function initViz() {
              var containerDiv = document.getElementById("vizContainer2");
              var url = "${tableauUrl}";
              var options = {
                hideTabs: true,
                hideToolbar: false,
                width: "100%",
                height: "800px",
                onFirstInteractive: function () {
                  console.log("Viz loaded successfully");
                }
              };
              try {
                var viz = new tableau.Viz(containerDiv, url, options);
              } catch(e) {
                console.error("Error loading viz:", e);
              }
            }
            if (typeof tableau !== 'undefined') {
              initViz();
            } else {
              window.addEventListener('load', initViz);
            }
          </script>
        `;
        break;

      case 'trusted':
        // Method 3: Trusted ticket approach
        const trustedUrl = `${tableauUrl}?:embed=yes&:comments=no&:toolbar=yes&:refresh=yes`;
        container.innerHTML = `
          <iframe 
            src="${trustedUrl}"
            width="100%" 
            height="800"
            frameborder="0"
            allowfullscreen="true"
            webkitallowfullscreen="true"
            mozallowfullscreen="true">
          </iframe>
        `;
        break;

      case 'iframe':
        // Method 4: Simple iframe with all parameters
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
          
        container.innerHTML = `
          <iframe 
            src="${iframeUrl}"
            width="100%" 
            height="800"
            frameborder="0"
            scrolling="no"
            allowfullscreen="true">
          </iframe>
        `;
        break;
    }

    // Check status after 5 seconds
    setTimeout(() => {
      setStatus({ 
        message: 'If dashboard is not visible, check browser console for errors', 
        type: 'info' 
      });
    }, 5000);
  };

  const openInNewTab = () => {
    window.open(tableauUrl, '_blank');
  };

  const checkDirectAccess = async () => {
    setStatus({ message: 'Checking direct access...', type: 'loading' });
    
    try {
      const response = await fetch(tableauUrl, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      setStatus({ 
        message: 'Request sent. Check if dashboard opens in new tab.', 
        type: 'info' 
      });
      openInNewTab();
    } catch (error) {
      setStatus({ 
        message: `Cannot verify access: ${error.message}`, 
        type: 'error' 
      });
    }
  };

  const clearDashboard = () => {
    setShowDashboard(false);
    const container = document.getElementById('vizContainer');
    if (container) {
      container.innerHTML = '';
    }
    setStatus({ message: '', type: '' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🔧 Tableau Embedding Troubleshooter</h1>
      
      {/* Step 1: Verify Access */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h2>Step 1: Verify Direct Access</h2>
        <p>First, let's check if you can access the dashboard directly:</p>
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={openInNewTab}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            📂 Open Dashboard in New Tab
          </button>
          <button
            onClick={checkDirectAccess}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔍 Check Access
          </button>
        </div>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          If the dashboard opens in a new tab, proceed to Step 2.
        </p>
      </div>

      {/* Step 2: Try Different Methods */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h2>Step 2: Try Different Embedding Methods</h2>
        <p>URL: <code style={{ backgroundColor: '#e9ecef', padding: '2px 4px' }}>{tableauUrl}</code></p>
        
        <div style={{ marginTop: '15px' }}>
          {testMethods.map((method, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => loadDashboardWithMethod(method.action)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
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
        id="vizContainer"
        style={{
          width: '100%',
          minHeight: showDashboard ? '800px' : '200px',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          padding: showDashboard ? '0' : '20px',
          backgroundColor: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!showDashboard && (
          <div style={{ textAlign: 'center', color: '#6c757d' }}>
            Dashboard will appear here after clicking a method above
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <h3>🐛 Debug Information</h3>
        <p>Check browser console (F12) for errors. Common issues:</p>
        <ul style={{ fontSize: '14px' }}>
          <li><strong>Refused to connect:</strong> CORS policy blocking - need server configuration</li>
          <li><strong>404 Not Found:</strong> URL might be incorrect or you lack permissions</li>
          <li><strong>Unauthorized:</strong> Need to authenticate with Tableau Server first</li>
          <li><strong>X-Frame-Options:</strong> Server blocking iframe embedding</li>
        </ul>
        
        <h4>Possible Solutions:</h4>
        <ol style={{ fontSize: '14px' }}>
          <li>Ensure you're logged into insights.citigroup.net</li>
          <li>Ask IT to whitelist localhost:3000 in Tableau Server</li>
          <li>Use Tableau Connected Apps or Personal Access Tokens</li>
          <li>Configure CORS settings on Tableau Server</li>
          <li>Try using a proxy server for development</li>
        </ol>
      </div>
    </div>
  );
}