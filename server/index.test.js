const request = require('supertest');
const { app, server } = require('./index');

const TEST_FILE_CONTENT = 'test image content';
const TEST_FILE_NAME = 'test-image.jpg';
const uploadFile = async () => {
  return await request(app)
    .post('/upload')
    .attach('file', Buffer.from(TEST_FILE_CONTENT), TEST_FILE_NAME);
};

let testServer;
beforeAll(() => {
    testServer = server();
});
  
afterAll(done => {
    testServer.close(done) ;
});

describe('GET /', () => {
    test('It should respond with 200 status code', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /healthcheck', () => {
    test('It should respond with 200 status code', async () => {
        const response = await request(app).get('/healthcheck');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /download/:filename', () => {
    test('It should download a file successfully', async () => {
        const uploadedResponse = await uploadFile();
        const testFileName = uploadedResponse.body.filename;
        const response = await request(app).get('/download/' + testFileName);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('File downloaded - ' + testFileName);
    });
});

describe('POST /upload', () => {
  test('POST /upload should upload an image successfully', async () => {
    const response = await uploadFile();

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully');
    expect(response.body.filename).toBe(TEST_FILE_NAME);
    expect(response.body.size).toBe(TEST_FILE_CONTENT.length);
    expect(response.body.mimetype).toBe('image/jpeg');
  });

  test('It should respond with 400 status code when no file is uploaded', async () => {
    const response = await request(app)
      .post('/upload');
    
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('No file uploaded.');
  });
});