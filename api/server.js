// api/server.js
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares
server.use(middlewares);

// Handle POST, PUT and PATCH
server.use(jsonServer.bodyParser);

// Custom middleware for CORS and logging
server.use((req, res, next) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  // Log requests (helpful for debugging)
  console.log('Request:', req.method, req.url);
  
  next();
});

// Custom routes for your school data
server.get('/schools/:schoolId/students', (req, res) => {
  const db = router.db;
  const schoolId = req.params.schoolId;
  const school = db.get('schools').find({ id: schoolId }).value();
  
  if (school) {
    res.json(school.students);
  } else {
    res.status(404).json({ error: "School not found" });
  }
});

server.get('/schools/:schoolId/teachers', (req, res) => {
  const db = router.db;
  const schoolId = req.params.schoolId;
  const school = db.get('schools').find({ id: schoolId }).value();
  
  if (school) {
    res.json(school.teachers);
  } else {
    res.status(404).json({ error: "School not found" });
  }
});

server.get('/schools/:schoolId/attendances', (req, res) => {
  const db = router.db;
  const schoolId = req.params.schoolId;
  const school = db.get('schools').find({ id: schoolId }).value();
  
  if (school) {
    res.json(school.attendances);
  } else {
    res.status(404).json({ error: "School not found" });
  }
});

// Use default router
server.use(router);

// Error handling
server.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Try different ports if default is in use
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = require('http').createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
};

// Start server with dynamic port
if (require.main === module) {
  findAvailablePort(4000).then(port => {
    server.listen(port, () => {
      console.log(`JSON Server is running on http://localhost:${port}`);
    });
  });
}

module.exports = server;