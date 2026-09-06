import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Root route (Cannot GET / fix karne ke liye)
app.get('/', (req, res) => {
  res.send('CloudVault Backend is running successfully!');
});

app.use('/api/files', fileRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', engine: 'Supabase-Backed Architecture' });
});

export default app;
