"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const multer_1 = __importDefault(require("multer"));
const azure_storage_1 = __importDefault(require("azure-storage"));
const express_1 = __importDefault(require("express"));
const azureUrl = process.env.AZURE_URL;
if (!azureUrl) {
    throw new Error("AZURE_URL is not defined. Please set the environment variable.");
}
let blobService;
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 3001;
const server = () => app.listen(port, () => {
    if (azureUrl) {
        blobService = azure_storage_1.default.createBlobService(azureUrl);
        console.log('Booting up server with Azure Blob Storage');
    }
    console.log(`Server is running on http://localhost:${port}`);
});
exports.server = server;
// In-memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
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
    let containers = [];
    const token = null;
    blobService.listContainersSegmented(token, (error, result, response) => {
        if (error) {
            res.status(400).send('Error listing containers');
        }
        else {
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
if (require.main === module) {
    server();
}
;
//# sourceMappingURL=index.js.map