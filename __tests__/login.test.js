const request = require('supertest');
const app = require('../app.js');

let auth_token; //To store and check later if we've logged in correctly 

//Testing login
describe('POST /api/v1/users/login', () => {
    test('should return 200 OK and a token on successful login', async () => {
        const response = await request(app)
            .post('/api/v1/users/login')
            .send({
                username: "alan.josy",
                password: "AlanJosy44@"
            })
            .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        auth_token = response.body.accessToken;
    });

    test('should return 401 Unauthorized on invalid credentials', async () => {
        const response = await request(app)
            .post('/api/v1/users/login')
            .send({
                username: "alan.josy",
                password: "alan.josy"
            })
            .expect(401);

        expect(response.body).toEqual({ msg: `Passwords don't match. Are you trynna hack?` });
    });
});

//Test authorization
describe('GET /api/v1/users/{username}', () => {
    const username = 'alan.josy';

    test('should return 200 OK with protected data when authenticated', async () => {
        const response = await request(app)
            .get(`/api/v1/users/${username}`)
            .set('Authorization', 'Bearer ' + auth_token)
            .expect(200);

        // assert that the response body contains the protected data
        expect(response.body).toHaveProperty('data');
    });

    test('should return 401 Unauthorized when not authenticated', async () => {
        const response = await request(app)
            .get(`/api/v1/users/${username}`)
            .expect(401);

        // assert that the response body contains the expected error message
        expect(response.body).toEqual({ msg: "Where's your token? Boy!" });
    });
});

//Testing signup
describe('POST /api/v1/users/signup', () => {
    test('should return 201 Created and a token on successful signup', async () => {
        const response = await request(app)
            .post('/api/v1/users/signup')
            .send({
                username: 'John Doe',
                email: 'john@example.com',
                password: 'Password123@',
            })
            .expect(201);

        expect(response.body).toHaveProperty('accessToken');
        auth_token = response.body.accessToken;
    });

    test('should return 400 Bad Request on invalid input', async () => {
        const givenUsername = 'John Doe';
        const response = await request(app)
            .post('/api/v1/users/signup')
            .send({
                username: givenUsername,
                email: 'john@example.com',
                password: 'short',
            })
            .expect(400);

        expect(response.body).toEqual({ msg: `Name ${givenUsername} already taken. Try to be original won't ya?` });
    });
});

