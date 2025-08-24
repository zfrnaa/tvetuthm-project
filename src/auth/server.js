import "dotenv/config.js";
import express from "express";
import router from "./authCtoF.js";
import cors from "cors";
import compression from "compression";

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

// Attach your router
app.use(router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});