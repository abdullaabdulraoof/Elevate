require("dotenv").config();

import { listen } from "./app";
import connectDB from "./config/db";
import { info } from "./logger";

const PORT = process.env.PORT || 3000;

connectDB();

info("Server starting...");

listen(PORT, () => {
    info(`Server running on http://localhost:${PORT}`);
});