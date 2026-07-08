const express = require('express')
const cors = require('cors');
require('dotenv').config();
const logger = require('./logger');
const morgan = require('morgan');
const WebSocket = require('ws');
const connectDB = require('./config/db');
const userRoutes = require('./routes/authRoute');
const userManagementRoutes = require('./routes/userRoute');
const planRoutes = require('./routes/planRoute');
const memberRoutes = require('./routes/memberRoute');
const attendanceRoutes = require('./routes/attendenceRoute');
const paymentRoutes = require('./routes/paymentRoute');
const trainerRoutes = require('./routes/trainerRoute');
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");


// Connect to MongoDB
connectDB();
const app = express()
const port = 3000
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

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
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/users', userManagementRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/payments', paymentRoutes);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
logger.info('Server starting...');
app.listen(port, () => {
   logger.info(`Server running on http://localhost:${port}`);
})