// index.js
const azure = require('azure-storage');
const blobService = azure.createBlobService(process.env.AZURE_URL);
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

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

app.post('/upload', (req, res) => {
  if (req.file) {
    console.log('Received file:', req.file.name);
  }
  // Upload a file
  blobService.createBlockBlobFromLocalFile('mycontainer', 'myblob', 'test.txt', (error, result, response) => {
    if (error) {
      console.error('Error uploading file:', error);
    } else {
      console.log('Uploaded file:', result);
    }
  });
  res.status(200).send('Uploaded');
});

const server = () => app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

if (require.main === module) {
  server();
};

module.exports = { app, server };

