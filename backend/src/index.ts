import "dotenv/config";
import express from "express";
import cors from "cors";

import { getProperties } from "./use-cases/getProperties";

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',    
    'http://localhost:5173',   
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
};

app.use(cors());
const port = process.env.PORT || 5000;

app.get("/", (_req, res) => res.send("Warden Weather Test: OK"));
app.use(`/get-properties`, getProperties);

app.listen(port, () => console.log(`Server on http://localhost:${port}`));
