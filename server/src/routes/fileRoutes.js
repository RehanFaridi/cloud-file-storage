import express from 'express';
import {
  saveMetadata,
  listFiles,
  downloadFile,
  deleteFile,
  shareFile,
  getVersions,
} from '../controllers/fileController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/metadata', saveMetadata);
router.get('/', listFiles);
router.get('/:id/download', downloadFile);
router.delete('/:id', deleteFile);
router.post('/:id/share', shareFile);
router.get('/:id/versions', getVersions);

export default router;
