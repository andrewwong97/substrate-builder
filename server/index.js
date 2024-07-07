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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/healthcheck', (req, res) => {
  // Create a container
  blobService.createContainerIfNotExists('mycontainer', { publicAccessLevel: 'blob' }, (error, result, response) => {
    if (error) {
      console.error('Error creating container:', error);
    } else {
      console.log('Created?', result.created);
    }
  });
  // List containers
  let containers = []
  blobService.listContainersSegmented(null, (error, result, response) => {
    if (error) {
      console.error('Error listing containers:', error);
    } else {
      console.log('Containers:');
      containers = result.entries.map(container => container.name);
      result.entries.forEach(container => {
        console.log('-', container.name);
      });
    }
  });
  res.send('Done ' + containers.join(', '));
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.file;
  const fileName = `${Date.now()}-${file.originalname}`;

  res.status(200).json({
    message: 'File uploaded successfully',
    filename: fileName,
    mimetype: file.mimetype,
    size: file.size
  });
});

const server = () => app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

if (require.main === module) {
  server();
};

module.exports = { app, server };

