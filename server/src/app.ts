import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.send('UNPAR Task Management API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Test the API at http://localhost:${port}`);
});