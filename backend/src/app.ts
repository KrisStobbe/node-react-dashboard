import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import jobRoutes from "./routes/jobs";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 80;

/**
 * Middleware to enable CORS (Cross-Origin Resource Sharing) headers.
 */
app.use(cors());

/**
 * Register jobRoutes for all `/api` endpoints.
 * All routes defined in jobRoutes will be prefixed with `/api`.
 */
app.use("/api", jobRoutes);

/**
 * Error handling middleware to catch and respond to errors across the app.
 *
 * @param err - Error object that may contain details about the error.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send back a desired HTTP response.
 */
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).send("Something broke!"); // Send a user-friendly error message.
});

/**
 * Starts a UNIX socket and listens for connections on the given path.
 *
 * @param PORT - The port on which the server is to listen.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
