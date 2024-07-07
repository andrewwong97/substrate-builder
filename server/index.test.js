const request = require('supertest');
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

// describe('POST /upload', () => {
//   test('It should respond with 200 status code for successful upload', async () => {
//     const response = await request(app)
//       .post('/upload')
//       .attach('image', 'path/to/test-image.jpg');
    
//     expect(response.statusCode).toBe(200);
//     expect(response.text).toBe('File uploaded successfully');
//   });

//   test('It should respond with 400 status code when no file is uploaded', async () => {
//     const response = await request(app)
//       .post('/upload');
    
//     expect(response.statusCode).toBe(400);
//     expect(response.text).toBe('No file uploaded.');
//   });
// });