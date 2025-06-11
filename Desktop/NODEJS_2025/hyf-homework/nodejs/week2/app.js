import express from 'express';
import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is a search engine");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const documentsFilePath = path.join(__dirname, 'documents.json');

async function getDocuments() {
  try {
    const data = await fs.readFile(documentsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading documents:", error);
    throw error;
  }
}
app.get("/", (req, res) => {
  res.send("This is a search engine");
});
app.get("/search", async (req, res) => {
  const documents = await getDocuments();
  const query = req.query.q ? String(req.query.q).toLowerCase() : null;

  if (!query) {
    return res.json(documents);
  }

  const filteredDocuments = documents.filter(doc => {
    for (const key in doc) {
   if (Object.hasOwnProperty.call(doc, key)) {
    const value = String(doc[key]).toLowerCase();
   if (value.includes(query)) {
          return true; // Match found, include this document in the result.
        }
      }
    }
    return false; // No match found in any field for this document.
  });
  res.json(filteredDocuments);  
});

app.get("/documents/:id", async (req, res) => {
  const documents = await getDocuments();
const id = parseInt(req.params.id);
if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID provided. ID must be a number." });
  }
const document = documents.find(doc => doc.id === id);

  if (document) {
    res.json(document); // Document found, send it.
  } else {
res.status(404).json({ message: `Document with ID ${id} not found.` });
  }
});


app.post("/search", async (req, res) => {
    const documents = await getDocuments();
  const { query } = req.query.q;
  const fields = req.body.fields;
  if (query && fields) {
    return res.status(400).json({
      message: "Bad Request: Cannot provide both 'q' query parameter and 'fields' in the request body."
    });
  }
  if (!query) {
    return res.status(400).send("Query parameter 'query' is required");
  }
  let filteredDocuments = documents;
  if (query) {
    filteredDocuments = documents.filter(doc => {
      for (const key in doc) {
        if (Object.hasOwnProperty.call(doc, key)) {
          const value = String(doc[key]).toLowerCase();
          if (value.includes(query.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });
  } else if (fields) {
    if (typeof fields !== 'object' || fields === null) {
      return res.status(400).json({ message: "Invalid 'fields' format. It must be a JSON object." });
    }
    filteredDocuments = documents.filter(doc => {
      for (const fieldKey in fields) {
        if (Object.hasOwnProperty.call(fields, fieldKey)) {
          const expectedValue = String(fields[fieldKey]).toLowerCase();
          if (!Object.hasOwnProperty.call(doc, fieldKey) || String(doc[fieldKey]).toLowerCase() !== expectedValue) {
            return false; // This document does not match ALL field conditions, so exclude it.
          }
        }
      }
      return true; // All field conditions in 'fields' object matched for this document.
    });
  } else {
    return res.json(documents);
  }

  res.json(filteredDocuments); // Send the final filtered documents.
});
app.listen(port, () => {
  console.log(`Search engine listening on port ${port}`);
});