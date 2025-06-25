"use client";
import { useState, useEffect } from 'react';

export default function TableauDiagnostic() {
  const [tableauUrl, setTableauUrl] = useState('https://insights.citigroup.net/t/GCT/views/TMAnalyticalEngine-NAM17344285020630/1-NAMQEFunctionalTestSummary');
  const [diagnostics, setDiagnostics] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  const addDiagnostic = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setDiagnostics(prev => [...prev, { message, type, timestamp }]);
  };

  const clearDiagnostics = () => {
    setDiagnostics([]);
  };

  // Test 1: Check if we can fetch any resource from the domain
  const testCORS = async () => {
    addDiagnostic('Testing CORS with fetch...', 'loading');
    
    try {
      const response = await fetch(tableauUrl, {
        method: 'HEAD',
        mode: 'cors',
        credentials: 'include'
      });
      addDiagnostic(`✅ CORS test successful: ${response.status}`, 'success');
    } catch (error) {
      addDiagnostic(`❌ CORS blocked: ${error.message}`, 'error');
    }
  };

  // Test 2: Check with no-cors mode
  const testNoCORS = async () => {
    addDiagnostic('Testing with no-cors mode...', 'loading');
    
    try {
      const response = await fetch(tableauUrl, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      addDiagnostic('⚠️ No-cors request sent (opaque response)', 'warning');
    } catch (error) {
      addDiagnostic(`❌ Even no-cors failed: ${error.message}`, 'error');
    }
  };

  // Test 3: Create script tag to load Tableau API
  const testScriptLoad = () => {
    addDiagnostic('Testing Tableau API script load...', 'loading');
    
    const script = document.createElement('script');
    script.src = 'https://insights.citigroup.net/javascripts/api/tableau.embedding.3.latest.min.js';
    script.type = 'module';
    
    script.onload = () => {
      addDiagnostic('✅ Tableau API script loaded!', 'success');
      addDiagnostic('Checking if tableau object exists...', 'info');
      
      setTimeout(() => {
        if (window.tableau || window.tableauSoftware) {
          addDiagnostic('✅ Tableau object found in window', 'success');
        } else {
          addDiagnostic('❌ Tableau object NOT found in window', 'error');
        }
      }, 1000);
    };
    
    script.onerror = (error) => {
      addDiagnostic(`❌ Script failed to load: ${error}`, 'error');
    };
    
    document.head.appendChild(script);
  };

  // Test 4: Try creating an iframe programmatically
  const testIframe = () => {
    addDiagnostic('Creating test iframe...', 'loading');
    
    const iframe = document.createElement('iframe');
    iframe.src = tableauUrl;
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    
    iframe.onload = () => {
      addDiagnostic('⚠️ Iframe onload fired (but content may be blocked)', 'warning');
      
      try {
        // Try to access iframe content
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        addDiagnostic('✅ Can access iframe document', 'success');
      } catch (error) {
        addDiagnostic('❌ Cannot access iframe content (cross-origin)', 'error');
      }
    };
    
    iframe.onerror = () => {
      addDiagnostic('❌ Iframe error event fired', 'error');
    };
    
    document.body.appendChild(iframe);
    
    // Check after 3 seconds
    setTimeout(() => {
      addDiagnostic('Checking iframe status...', 'info');
      if (iframe.contentWindow) {
        try {
          // This will throw if cross-origin
          const test = iframe.contentWindow.location.href;
          addDiagnostic('✅ Iframe loaded successfully', 'success');
        } catch (e) {
          addDiagnostic('❌ Iframe blocked by cross-origin policy', 'error');
        }
      }
      document.body.removeChild(iframe);
    }, 3000);
  };

  // Test 5: Check Content Security Policy
  const testCSP = () => {
    addDiagnostic('Checking Content Security Policy...', 'loading');
    
    // Create a test element that would violate CSP
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `<img src="${tableauUrl}/favicon.ico" onerror="console.log('CSP Test')" />`;
    document.body.appendChild(testDiv);
    
    setTimeout(() => {
      const img = testDiv.querySelector('img');
      if (img && img.complete && img.naturalHeight === 0) {
        addDiagnostic('❌ CSP or CORS blocking image load', 'error');
      } else if (img && img.complete) {
        addDiagnostic('✅ Can load resources from domain', 'success');
      }
      document.body.removeChild(testDiv);
    }, 2000);
  };

  // Run all diagnostics
  const runAllDiagnostics = async () => {
    setIsChecking(true);
    clearDiagnostics();
    
    addDiagnostic('Starting diagnostics...', 'info');
    addDiagnostic(`Testing URL: ${tableauUrl}`, 'info');
    
    // Run tests sequentially
    await testCORS();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testNoCORS();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    testScriptLoad();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    testIframe();
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    testCSP();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    addDiagnostic('Diagnostics complete!', 'success');
    setIsChecking(false);
  };

  // Check browser info
  const checkBrowserInfo = () => {
    addDiagnostic('Browser Information:', 'info');
    addDiagnostic(`User Agent: ${navigator.userAgent}`, 'info');
    addDiagnostic(`Current Origin: ${window.location.origin}`, 'info');
    addDiagnostic(`Protocol: ${window.location.protocol}`, 'info');
    
    // Check if running in iframe
    if (window.self !== window.top) {
      addDiagnostic('⚠️ This page is running inside an iframe', 'warning');
    }
    
    // Check for mixed content
    if (window.location.protocol === 'https:' && tableauUrl.startsWith('http:')) {
      addDiagnostic('⚠️ Mixed content: HTTPS page trying to load HTTP content', 'warning');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔬 Tableau Embedding Diagnostic Tool</h1>
      
      <div style={{
        backgroundColor: '#d1ecf1',
        border: '1px solid #bee5eb',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <p style={{ margin: 0 }}>
          <strong>What you discovered:</strong> No network requests when clicking iframe/embed = 
          Browser is blocking the attempt before it starts!
        </p>
      </div>

      {/* URL Input */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Tableau Dashboard URL:
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

      {/* Diagnostic Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runAllDiagnostics}
          disabled={isChecking}
          style={{
            padding: '12px 24px',
            backgroundColor: isChecking ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isChecking ? 'not-allowed' : 'pointer',
            marginRight: '10px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isChecking ? '🔄 Running Diagnostics...' : '🚀 Run Full Diagnostics'}
        </button>
        
        <button
          onClick={checkBrowserInfo}
          style={{
            padding: '12px 24px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
            fontSize: '16px'
          }}
        >
          📊 Check Browser Info
        </button>
        
        <button
          onClick={clearDiagnostics}
          style={{
            padding: '12px 24px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Diagnostic Results */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px',
        minHeight: '300px',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        <h3>Diagnostic Results:</h3>
        {diagnostics.length === 0 ? (
          <p style={{ color: '#6c757d' }}>Click "Run Full Diagnostics" to start...</p>
        ) : (
          <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            {diagnostics.map((diag, index) => (
              <div
                key={index}
                style={{
                  padding: '8px',
                  marginBottom: '4px',
                  borderRadius: '4px',
                  backgroundColor:
                    diag.type === 'success' ? '#d4edda' :
                    diag.type === 'error' ? '#f8d7da' :
                    diag.type === 'warning' ? '#fff3cd' :
                    diag.type === 'loading' ? '#cce5ff' :
                    '#e2e3e5',
                  color:
                    diag.type === 'success' ? '#155724' :
                    diag.type === 'error' ? '#721c24' :
                    diag.type === 'warning' ? '#856404' :
                    diag.type === 'loading' ? '#004085' :
                    '#383d41'
                }}
              >
                <span style={{ color: '#6c757d', marginRight: '10px' }}>
                  [{diag.timestamp}]
                </span>
                {diag.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Solution */}
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px'
      }}>
        <h3>💡 What This Means:</h3>
        <p>If no network requests appear in the Network tab, the browser is blocking the embed attempt due to:</p>
        <ul>
          <li><strong>Content Security Policy (CSP)</strong> - The page has security headers preventing embedding</li>
          <li><strong>X-Frame-Options</strong> - The server explicitly blocks iframe embedding</li>
          <li><strong>CORS Policy</strong> - Cross-origin requests are blocked</li>
        </ul>
        
        <h4>✅ The Only Solutions:</h4>
        <ol>
          <li><strong>Server Configuration:</strong> Tableau admin must allow embedding from your domain</li>
          <li><strong>Use Tableau's JavaScript API with authentication</strong></li>
          <li><strong>Implement a backend proxy</strong> that fetches and serves the content</li>
          <li><strong>Use Tableau REST API</strong> to get data and render your own charts</li>
        </ol>
      </div>
    </div>
  );
}