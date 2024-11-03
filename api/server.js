// api/server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares
server.use(middlewares);

// Handle POST, PUT, and PATCH
server.use(jsonServer.bodyParser);

// Custom middleware for CORS and logging
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

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

// Export as a Vercel serverless function
module.exports = server;
