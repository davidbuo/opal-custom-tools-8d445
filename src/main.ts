import { ToolsService } from "@optimizely-opal/opal-tools-sdk";
import cors from "cors";
import express from "express";
import basicAuth from "express-basic-auth";

// Create Express app
const app = express();
app.use(express.json());
app.use(cors());
app.use('/public', express.static('public'));

// Custom middleware to apply basic auth only to non-public assets
app.use((req, res, next) => {
  if (req.path.startsWith('/public/') || req.path === '/rick.gif') {
    return next(); // Skip auth for public assets
  }
  return basicAuth({
    users: { 'admin': 'password' },
    challenge: true,
  })(req, res, next);
});

// Create Tools Service
const toolsService = new ToolsService(app);

// Import tools
import "./tools/api-call";
import "./tools/web-analytics-report";
import "./tools/db_create_blog_cms";
import "./tools/db_cms12_create_blog";
import "./tools/db_cms12_update_page";
import "./tools/db_create_cms_page";
import "./tools/db_get_cms_page";
import "./tools/db_cms12_get_page_by_id";
import "./tools/db_cms12_search_pages";

// Export the Express app for serverless environments
export { app };

// Start the server only when running locally (not in serverless environments)
if (process.env.NODE_ENV !== 'production' || process.env.NETLIFY !== 'true') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Discovery endpoint: http://localhost:${PORT}/discovery`);
  });
}
