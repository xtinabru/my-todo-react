import express from 'express';
import cors from 'cors';
import todoRouter from './routers/todoRouter.js';

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', todoRouter)

// start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack); // logging errors on server
  
  // define status (if exists) or 500 
  const statusCode = err.status || 500;

  // send JSON with error
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
});
