import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './src/routes/routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server started on port " + PORT));