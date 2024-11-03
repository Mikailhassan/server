// api/index.js
import jsonServer from 'json-server';
import { createServer } from 'http';
import { parse } from 'url';

// Create JSON Server instance
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configure middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// CORS middleware
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Custom routes
const handleSchoolRoute = (req, res, type) => {
  const db = router.db;
  const { schoolId } = req.query;
  
  if (!schoolId) {
    return res.status(400).json({ error: "School ID is required" });
  }
  
  const school = db.get('schools').find({ id: schoolId }).value();
  
  if (school) {
    res.json(school[type]);
  } else {
    res.status(404).json({ error: "School not found" });
  }
};

// API handler for Vercel
const handler = (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  // Set appropriate headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Route handling
  if (pathname.startsWith('/api/schools/')) {
    if (pathname.includes('/students')) {
      return handleSchoolRoute(req, res, 'students');
    } else if (pathname.includes('/teachers')) {
      return handleSchoolRoute(req, res, 'teachers');
    } else if (pathname.includes('/attendances')) {
      return handleSchoolRoute(req, res, 'attendances');
    }
  }

  // Default json-server router
  return router(req, res);
};

export default handler;