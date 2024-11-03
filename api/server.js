// api/server.js
const jsonServer = require('json-server');
const path = require('path');

// Create express server
const server = jsonServer.create();

// Create a static database object instead of reading from file
const db = {
  "schools": [
    {
      "id": "1",
      "name": "Sample School",
      "students": [
        {
          "id": "1",
          "name": "John Doe",
          "grade": "10"
        }
      ],
      "teachers": [
        {
          "id": "1",
          "name": "Jane Smith",
          "subject": "Mathematics"
        }
      ],
      "attendances": [
        {
          "id": "1",
          "date": "2024-03-01",
          "present": true
        }
      ]
    }
  ]
};

// Create router using the static database
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Handle POST, PUT and PATCH
server.use(jsonServer.bodyParser);

// Custom routes for school data
server.get('/schools/:schoolId/students', (req, res) => {
  const schoolId = req.params.schoolId;
  const school = db.schools.find(s => s.id === schoolId);
  
  if (school) {
    res.json(school.students);
  } else {
    res.status(404).json({ error: "School not found" });
  }
});

server.get('/schools/:schoolId/teachers', (req, res) => {
  const schoolId = req.params.schoolId;
  const school = db.schools.find(s => s.id === schoolId);
  
  if (school) {
    res.json(school.teachers);
  } else {
    res.status(404).json({ error: "School not found" });
  }
});

server.get('/schools/:schoolId/attendances', (req, res) => {
  const schoolId = req.params.schoolId;
  const school = db.schools.find(s => s.id === schoolId);
  
  if (school) {
    res.json(school.attendances);
  } else {
    res.status(404).json({ error: "School not found" });
  }
});

// Add custom routes before json-server router
server.use(router);

// Error handling middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// For Vercel, we need to export the configured server
module.exports = server;