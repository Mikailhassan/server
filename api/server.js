// api/server.js
const jsonServer = require('json-server');
const path = require('path');

// Create express server
const server = jsonServer.create();

// Resolve path to db.json
const dbPath = path.resolve(process.cwd(), 'db.json');

// Create router using the json file
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults({
  readOnly: false,
  noCors: true, // We'll handle CORS in vercel.json
  bodyParser: true
});

// Set default middlewares
server.use(middlewares);

// Handle POST, PUT and PATCH
server.use(jsonServer.bodyParser);

// Custom routes for school data
server.get('/schools/:schoolId/students', (req, res) => {
  const db = router.db; // Access the lowdb instance
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

// Add generic routes
server.use(router);

// Error handling middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = server;