const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const core = require('@actions/core')

describe('Test /applications endpoint', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /applications/relevantApplication', () => {
        // test('Should respond with 200 success', async () => {
        //     const response = await request(app)
        //         .get('/applications/relevantApplication?age=30&category=social&customertype=bronze')
        //         .expect('Content-Type', /json/)
        //         .expect(200)
        //         .expect(verifyCategory);
        //         core.info(`get res ${response.body}`)
        //         console.log('get res', response.body)
        // });

        test('Should respond with 400, missing parameter', async () => {
            const response = await request(app)
                .get('/applications/relevantApplication?category=social&customertype=bronze')
                .expect('Content-Type', /json/)
                .expect(400);

                expect(response.body).toStrictEqual({
                    error: 'missing at least one parameter'
                })
        });
        function verifyCategory(res) {
            const body = res.body;
            if (body.length != 2) throw new Error('number of returned apps is different than 2');
            if (body[0].category !== 'social') throw new Error('retrieved wrong app category for first app');
            if (body[1].category !== 'social') throw new Error('retrieved wrong app category for second app');
        }

        test('Should respond with 404 not found', async () => {
            const response = await request(app)
                .get('/applications/relevantApplication?age=30&category=social&customertype=blue')
                .expect('Content-Type', /json/)
                .expect(404);

                expect(response.body).toStrictEqual({
                    error: 'customer type not found'
                })
        });

        test('Should respond with 400, invalid app', async () => {
            const response = await request(app)
                .get('/applications/relevantApplication?age=30&category=socal&customertype=bronze')
                .expect('Content-Type', /json/)
                .expect(400);

                expect(response.body).toStrictEqual({
                    error: 'invalid app category'
                });
        });
    });

    describe('Test POST /applications/installedApps', () => {
        const completeAppData = {
            age: 50,
            installedapp: "instagram"
        }

        const appDataAgeTypo = {
            ae: 50,
            installedapp: "instagram"
        }

        const appDataAgeNotInt = {
            age: 50.5,
            installedapp: "instagram"
        }

        const appDataWrongName = {
            age: 30,
            installedapp: "instegram"
        }
        const exampleResponseObj = {
            updated: true,
            updatedObj: {
                _id: "626ea3f42c1a6268e2d4833b",
                name: "instagram",
                category: "social"
            }
        }
        // test('Should respond with 201, success: true', async () => {
        //     const response = await request(app)
        //         .post('/applications/installedApps')
        //         .send(completeAppData)
        //         .expect('Content-Type', /json/)
        //         .expect(201);
        //         console.log('post res', response.body)
        //         expect(response.body).toMatchObject(exampleResponseObj)
        // });

        test('Should respond with 400, missing parameter', async () => {
            const response = await request(app)
                .post('/applications/installedApps')
                .send(appDataAgeTypo)
                .expect('Content-Type', /json/)
                .expect(400);

                expect(response.body).toStrictEqual({
                    error: 'missing at least one parameter'
                });
        });

        test('Should respond with 400, age parameter is not an Int', async () => {
            const response = await request(app)
                .post('/applications/installedApps')
                .send(appDataAgeNotInt)
                .expect('Content-Type', /json/)
                .expect(400);

                expect(response.body).toStrictEqual({
                    error: 'age parameter is not an Int'
                });
        });

        test('Should respond with 404, app not found', async () => {
            const response = await request(app)
                .post('/applications/installedApps')
                .send(appDataWrongName)
                .expect('Content-Type', /json/)
                .expect(404);

                expect(response.body).toStrictEqual({
                    error: 'no matching app found'
                });
        });
    })
});

