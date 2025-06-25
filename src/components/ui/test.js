"use client";
import { useState, useEffect, useRef } from 'react';

export default function TableauEmbedSolution() {
  const [tableauUrl, setTableauUrl] = useState('https://insights.citigroup.net/t/GCT/views/TMAnalyticalEngine-NAM17344285020630/1-NAMQEFunctionalTestSummary');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [activeMethod, setActiveMethod] = useState(null);
  
  // Create separate refs for each method to avoid conflicts
  const embedRef = useRef(null);
  const jsapiRef = useRef(null);
  const trustedRef = useRef(null);
  const iframeRef = useRef(null);

  // Method 1: Tableau Embedding API v3
  const loadEmbedMethod = () => {
    setActiveMethod('embed');
    setStatus({ message: 'Loading Embedding API v3...', type: 'loading' });
    
    // Clear only this specific container
    if (embedRef.current) {
      embedRef.current.innerHTML = '';
    }

    // Create a wrapper div to contain everything
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div id="embed-wrapper">
        <script type="module" src="https://insights.citigroup.net/javascripts/api/tableau.embedding.3.latest.min.js"></script>
        <tableau-viz 
          id="tableau-viz-embed" 
          src="${tableauUrl}"
          width="100%" 
          height="800"
          hide-tabs="true"
          toolbar="bottom">
        </tableau-viz>
      </div>
    `;
    
    if (embedRef.current) {
      embedRef.current.appendChild(wrapper);
    }
    
    setTimeout(() => {
      setStatus({ message: 'Check if dashboard loaded below. If not, see console.', type: 'info' });
    }, 3000);
  };

  // Method 2: Direct iframe with minimal interference
  const loadIframeMethod = () => {
    setActiveMethod('iframe');
    setStatus({ message: 'Loading iframe...', type: 'loading' });
    
    if (iframeRef.current) {
      iframeRef.current.innerHTML = '';
    }

    const iframe = document.createElement('iframe');
    iframe.src = `${tableauUrl}?:embed=y&:showVizHome=no`;
    iframe.width = '100%';
    iframe.height = '800';
    iframe.style.border = 'none';
    
    iframe.onload = () => {
      setStatus({ message: 'Iframe loaded. If blank, server is blocking embedding.', type: 'info' });
    };
    
    if (iframeRef.current) {
      iframeRef.current.appendChild(iframe);
    }
  };

  // Method 3: Window.open with postMessage (Workaround)
  const loadPopupMethod = () => {
    setStatus({ message: 'Opening in popup window...', type: 'info' });
    
    const width = 1200;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      tableauUrl,
      'tableauDashboard',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    );
    
    if (popup) {
      setStatus({ message: '✅ Dashboard opened in popup window', type: 'success' });
    } else {
      setStatus({ message: '❌ Popup blocked. Allow popups for this site.', type: 'error' });
    }
  };

  // Method 4: Copy embed code for user
  const copyEmbedCode = () => {
    const embedCode = `<script type='module' src='https://insights.citigroup.net/javascripts/api/tableau.embedding.3.latest.min.js'></script>
<tableau-viz 
  id='tableau-viz' 
  src='${tableauUrl}'
  width='1900' 
  height='1113' 
  toolbar='bottom'>
</tableau-viz>`;
    
    navigator.clipboard.writeText(embedCode).then(() => {
      setStatus({ message: '✅ Embed code copied to clipboard!', type: 'success' });
    }).catch(() => {
      setStatus({ message: '❌ Failed to copy', type: 'error' });
    });
  };

  // Clear all containers
  const clearAll = () => {
    setActiveMethod(null);
    setStatus({ message: '', type: '' });
    
    // Clear each ref safely
    [embedRef, jsapiRef, trustedRef, iframeRef].forEach(ref => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🎯 Tableau Dashboard Embed Test</h1>
      
      {/* URL Input */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Dashboard URL:
        </label>
        <input
          type="text"
          value={tableauUrl}
          onChange={(e) => setTableauUrl(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h3>Test Methods:</h3>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          <button
            onClick={loadEmbedMethod}
            disabled={activeMethod === 'embed'}
            style={{
              padding: '12px 20px',
              backgroundColor: activeMethod === 'embed' ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: activeMethod === 'embed' ? 'default' : 'pointer',
              opacity: activeMethod === 'embed' ? 0.8 : 1,
              textAlign: 'left'
            }}
          >
            <strong>Method 1: Embedding API v3</strong>
            <br />
            <small>Uses Tableau's official embedding API</small>
          </button>

          <button
            onClick={loadIframeMethod}
            disabled={activeMethod === 'iframe'}
            style={{
              padding: '12px 20px',
              backgroundColor: activeMethod === 'iframe' ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: activeMethod === 'iframe' ? 'default' : 'pointer',
              opacity: activeMethod === 'iframe' ? 0.8 : 1,
              textAlign: 'left'
            }}
          >
            <strong>Method 2: Simple iFrame</strong>
            <br />
            <small>Basic iframe embedding</small>
          </button>

          <button
            onClick={loadPopupMethod}
            style={{
              padding: '12px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <strong>Method 3: Popup Window</strong>
            <br />
            <small>Opens dashboard in a separate window (works if direct access works)</small>
          </button>

          <button
            onClick={copyEmbedCode}
            style={{
              padding: '12px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <strong>Method 4: Copy Embed Code</strong>
            <br />
            <small>Copy the embed code to test elsewhere</small>
          </button>

          <button
            onClick={clearAll}
            style={{
              padding: '12px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Status */}
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

      {/* Display Areas - Separate containers for each method */}
      {activeMethod === 'embed' && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          border: '2px solid #007bff',
          borderRadius: '8px',
          backgroundColor: '#f8f9ff'
        }}>
          <h4>Embedding API v3 Container:</h4>
          <div ref={embedRef} style={{ width: '100%', minHeight: '100px' }} />
        </div>
      )}

      {activeMethod === 'iframe' && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          border: '2px solid #007bff',
          borderRadius: '8px',
          backgroundColor: '#f8f9ff'
        }}>
          <h4>iFrame Container:</h4>
          <div ref={iframeRef} style={{ width: '100%', minHeight: '100px' }} />
        </div>
      )}

      {/* The Solution */}
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px'
      }}>
        <h3>✅ The Real Solution:</h3>
        <p>Since you can access the dashboard directly, but embedding fails, you need to:</p>
        
        <ol>
          <li>
            <strong>For Development:</strong> Use Method 3 (Popup Window) as a temporary workaround
          </li>
          <li>
            <strong>For Production:</strong> Contact your Tableau administrator to:
            <ul>
              <li>Enable embedding for your domain in Tableau Server Settings</li>
              <li>Or implement Connected Apps with JWT authentication</li>
              <li>Or use Tableau's REST API to generate trusted tickets</li>
            </ul>
          </li>
        </ol>

        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px'
        }}>
          <strong>🔐 Security Note:</strong> Tableau Server blocks embedding by default for security. 
          This is intentional and requires server-side configuration to change.
        </div>
      </div>

      {/* Browser Console Check */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e2e3e5',
        border: '1px solid #d6d8db',
        borderRadius: '4px'
      }}>
        <strong>🔍 Check Browser Console:</strong>
        <ol style={{ marginBottom: 0 }}>
          <li>Press F12 to open Developer Tools</li>
          <li>Go to Console tab</li>
          <li>Look for errors like:
            <ul>
              <li><code>Refused to display in a frame because it set 'X-Frame-Options'</code></li>
              <li><code>blocked by CORS policy</code></li>
              <li><code>Content Security Policy</code></li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}