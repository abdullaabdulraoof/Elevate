const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./config/swagger');
const logger = require('./logger');

const userRoutes = require('./routes/authRoute');
const userManagementRoutes = require('./routes/userRoute');
const planRoutes = require('./routes/planRoute');
const memberRoutes = require('./routes/memberRoute');
const attendanceRoutes = require('./routes/attendenceRoute');
const paymentRoutes = require('./routes/paymentRoute');
const trainerRoutes = require('./routes/trainerRoute');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Morgan Logger
const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };

                logger.info(JSON.stringify(logObject));
            },
        },
    })
);

// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/users', userManagementRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/payments', paymentRoutes);

module.exports = app;