import { Request, Response } from 'express';
import multer from 'multer';
import azure, {BlobService} from 'azure-storage';
import express from 'express';

const azureUrl: string | undefined = process.env.AZURE_URL as string;

if (!azureUrl) {
  throw new Error("AZURE_URL is not defined. Please set the environment variable.");
}
let blobService: BlobService;
const app = express();
const port = process.env.PORT || 3001;

const server = () => app.listen(port, () => {
  if (azureUrl) {
    blobService = azure.createBlobService(azureUrl);
    console.log('Booting up server with Azure Blob Storage');
  }
  console.log(`Server is running on http://localhost:${port}`);
});

// In-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const tempFiles = new Map();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/healthcheck', (req: Request, res: Response) => {
  // Create a container
  blobService.createContainerIfNotExists('mycontainer', { publicAccessLevel: 'blob' }, (error, result, response) => {
    if (error) {
      res.status(500).send('Error creating container');
    }
  });
  // List containers
  let containers: Array<any> = []
  const token: any = null;
  blobService.listContainersSegmented(token, (error, result, response) => {
    if (error) {
      res.status(400).send('Error listing containers');
    } else {
      containers = result.entries.map(container => container.name);
    }
  });
  res.status(200).send('Done ' + containers);
});


app.get('/download/:filename', (req: Request, res: Response) => {
  const fileName: string = req.params.filename;
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

const saveFile = (filename: string) => {
  tempFiles.set(filename, filename);
};

if (require.main === module) {
  server();
};

export { app, server };

