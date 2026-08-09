import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Main Route Prefix
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
