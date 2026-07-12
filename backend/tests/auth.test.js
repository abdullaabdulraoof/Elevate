require("dotenv").config();

const request = require("supertest");
const app = require("../app");

describe("Authentication APIs", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/auth/register", () => {

        test("should return 400 when required fields are missing", async () => {

            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        test("should return 400 for invalid email", async () => {

            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    username: "John",
                    email: "invalid-email",
                    password: "123456"
                });

            expect(res.statusCode).toBe(400);
        });

    });

    describe("POST /api/v1/auth/login", () => {

        test("should return 400 when email and password are missing", async () => {

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({});

            expect(res.statusCode).toBe(400);
        });

        test("should return 400 for invalid email format", async () => {

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    email: "wrong-email",
                    password: "123456"
                });

            expect(res.statusCode).toBe(400);
        });

    });

});