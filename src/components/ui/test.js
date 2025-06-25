const TableauDashboard = () => {
    const tableauRef = useRef(null);
    const scriptRef = useRef(null);
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
      // First, check if we can access Tableau at all
      const checkTableauAccess = async () => {
        try {
          // Try to load the Tableau API script with type="module"
          const testScript = document.createElement('script');
          testScript.src = 'https://insights.citigroup.net/javascripts/api/tableau.embedding.3.latest.min.js';
          testScript.type = 'module'; // Add module type to handle ES6 exports
          
          testScript.onerror = () => {
            console.error('Cannot load Tableau API - likely authentication issue');
            setAuthError(true);
            setIsTableauLoading(false);
          };
          
          testScript.onload = () => {
            console.log('Tableau API accessible');
            setAuthError(false);
            // Wait a bit for the module to fully initialize
            setTimeout(() => {
              loadTableauDashboard();
            }, 100);
          };
          
          document.head.appendChild(testScript);
          scriptRef.current = testScript;
        } catch (error) {
          console.error('Error checking Tableau access:', error);
          setAuthError(true);
          setIsTableauLoading(false);
        }
      };

      const loadTableauDashboard = () => {
        if (!tableauRef.current || !selectedExecutiveTool) return;

        try {
          // Remove any existing tableau-viz element
          const existingViz = tableauRef.current.querySelector('tableau-viz');
          if (existingViz) {
            existingViz.remove();
          }

          // Create new tableau-viz element
          const tableauViz = document.createElement('tableau-viz');
          tableauViz.setAttribute('id', 'tableau-viz');
          tableauViz.setAttribute('src', selectedExecutiveTool.dashboardUrl);
          tableauViz.setAttribute('width', '100%');
          tableauViz.setAttribute('height', '100%');
          tableauViz.setAttribute('toolbar', 'bottom');
          tableauViz.setAttribute('hide-tabs', 'false');
          
          // Add event listeners
          tableauViz.addEventListener('firstinteractive', () => {
            console.log('Tableau dashboard interactive');
            setIsTableauLoading(false);
            const newNotification = {
              id: Date.now(),
              title: "Dashboard Loaded",
              message: `${selectedExecutiveTool.name} has been loaded successfully.`,
              date: new Date().toLocaleString(),
              read: false,
              type: "success"
            };
            setNotifications(prev => [newNotification, ...prev]);
          });

          tableauViz.addEventListener('error', (e) => {
            console.error('Tableau viz error:', e);
            setTableauError('Failed to load dashboard. This may be due to permissions or authentication.');
            setIsTableauLoading(false);
          });

          // Append to container
          tableauRef.current.appendChild(tableauViz);
        } catch (error) {
          console.error('Error creating Tableau viz:', error);
          setTableauError('Failed to create dashboard visualization.');
          setIsTableauLoading(false);
        }
      };

      if (selectedExecutiveTool) {
        setIsTableauLoading(true);
        checkTableauAccess();
      }

      // Cleanup
      return () => {
        if (scriptRef.current && scriptRef.current.parentNode) {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        }
        if (tableauRef.current) {
          const vizElement = tableauRef.current.querySelector('tableau-viz');
          if (vizElement) {
            vizElement.remove();
          }
        }
      };
    }, [selectedExecutiveTool]);