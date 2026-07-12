require("dotenv").config();

process.env.NODE_ENV = "test";

jest.setTimeout(30000);

// Mock Logger
jest.mock("../logger", () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

// Mock Nodemailer
jest.mock("nodemailer", () => ({
    createTransport: () => ({
        sendMail: jest.fn(),
    }),
}));

// Mock Redis
jest.mock("../config/redis", () => ({
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    quit: jest.fn(),
}));

// Mock BullMQ
jest.mock("bullmq", () => ({
    Queue: jest.fn().mockImplementation(() => ({
        add: jest.fn(),
    })),
}));

const mongoose = require("mongoose");

afterAll(async () => {
    await mongoose.connection.close();
});