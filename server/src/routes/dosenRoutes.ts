import express from 'express';
import { createDosen, getAllDosen, updateDosen } from '../controllers/dosenController';
import { isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', isAdmin, createDosen);
router.get('/', isAdmin, getAllDosen);
router.put('/:id', isAdmin, updateDosen);

export default router;