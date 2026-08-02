require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./logger");

// Force Redis initialization
require("./config/redis");

const PORT = process.env.PORT || 3000;

connectDB();

logger.info("Server starting...");

app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});