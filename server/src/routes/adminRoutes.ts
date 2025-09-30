import express from 'express';
const router = express.Router();

router.post('/dosen', (req, res) => {
  // TODO: Implement create dosen account
  res.json({ message: 'Create dosen account endpoint' });
});

router.get('/dosen', (req, res) => {
  // TODO: Implement get all dosen
  res.json({ message: 'Get all dosen endpoint' });
});

export default router;