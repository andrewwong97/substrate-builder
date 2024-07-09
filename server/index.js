// index.js
const azure = require('azure-storage');
const multer = require('multer');
const blobService = azure.createBlobService(process.env.AZURE_URL);
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// In-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const tempFiles = new Map();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/healthcheck', (req, res) => {
  // Create a container
  blobService.createContainerIfNotExists('mycontainer', { publicAccessLevel: 'blob' }, (error, result, response) => {
    if (error) {
      res.status(500).send('Error creating container');
    }
  });
  // List containers
  let containers = []
  blobService.listContainersSegmented(null, (error, result, response) => {
    if (error) {
      res.status(400).send('Error listing containers');
    } else {
      containers = result.entries.map(container => container.name);
    }
  });
  res.status(200).send('Done ' + containers);
});

app.get('/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const requestedFileName = tempFiles.get(fileName);
  
  res.status(200).send('File downloaded - ' + requestedFileName);
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  saveFile(file.originalname);

  res.status(200).json({
    message: 'File uploaded successfully',
    filename: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });
});

const saveFile = (filename) => {
  tempFiles.set(filename, filename);
};

const server = () => app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

if (require.main === module) {
  server();
};

module.exports = { app, server };

