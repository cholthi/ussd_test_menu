/**
 * HTTP Server for USSD application
 * Handles incoming USSD requests
 * This should typically be replaced with a proper web server in production like Express.js or Next.js(with Nginx)
 */

const http = require('http');
const url = require('url');
const stateMachine = require('./stateMachine');
const config = require('./config');

// Get port from config
const { PORT, USSD_CODE } = config;

/**
 * Create HTTP server
 */
const server = http.createServer(async (req, res) => {
  try {
    // Only handle GET requests to /ussd
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    if (req.method === 'GET' && pathname === '/ussd') {
      // Parse query parameters
      const query = parsedUrl.query;
      
      // Extract required parameters
      const msisdn = query.MSISDN;
      const fullInput = query.INPUT;
      const sessionId = query.SessionId;
      
      // Parse USSD input to extract the last segment (current input)
      // Input format can be like *183# or *183#*2*1234
      let input = '';
      
      if (fullInput) {
        // Remove the initial code if present (*183#)
        const cleanInput = fullInput.replace(/^\*\d+#/, '');
        
        if (cleanInput) {
          // Split by '*' and get the last segment
          const inputParts = cleanInput.split('*');
          input = inputParts[inputParts.length - 1] || '';
        }
      }
      
      console.log(`USSD Request: MSISDN=${msisdn}, INPUT=${input}, SessionId=${sessionId}`);
      
      // Validate required parameters
      if (!msisdn || !sessionId) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing required parameters: MSISDN or SessionId');
        return;
      }
      
      // Process request through state machine
      const response = await stateMachine.processRequest(msisdn, input, sessionId);
      
      // Set response headers
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'FreeFlow': response.headers.FreeFlow,
        'Content_Type': response.headers.Content_Type
      });
      
      // Send response body
      res.end(response.body);
      
      console.log(`USSD Response: FreeFlow=${response.headers.FreeFlow}, Body=${response.body}`);
      
    } else {
      // Not found
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  } catch (error) {
    console.error('Server error:', error);
    
    // Internal server error
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal server error');
  }
});

/**
 * Start server
 */
server.listen(PORT, () => {
  console.log(`USSD server listening on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/ussd?MSISDN=211925415377&INPUT=${USSD_CODE}&SessionId=g5767fnn5`);
});
