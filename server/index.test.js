const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app, server } = require('./index');

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

describe('POST /upload', () => {
  test('POST /upload should upload an image successfully', async () => {
    const testFileContent = 'test image content';
    const testFileName = 'test-image.jpg';

    const response = await request(app)
      .post('/upload')
      .attach('file', Buffer.from(testFileContent), testFileName);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully');
    expect(response.body.filename).toBeDefined();
    expect(response.body.size).toBe(testFileContent.length);
    expect(response.body.mimetype).toBe('image/jpeg');
  });

  test('It should respond with 400 status code when no file is uploaded', async () => {
    const response = await request(app)
      .post('/upload');
    
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('No file uploaded.');
  });
});