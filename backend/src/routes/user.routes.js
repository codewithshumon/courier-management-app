import express from 'express';
import {
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserPassword,
  uploadProfileImage,
  getCurrentUser,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/profiles'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

const router = express.Router();

router.use(protect);

router.get('/me', getCurrentUser);
router.put('/me', updateUser);
router.put('/me/password', updateUserPassword);
router.post('/me/profile-image', upload.single('profileImage'), uploadProfileImage);
router.delete('/me', deleteUser);

router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);

export default router;