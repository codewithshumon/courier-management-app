import express from 'express';
import {
  createParcel,
  getParcels,
  getParcel,
  updateParcelStatus,
  trackParcel,
  getParcelMetrics,
  getMyParcels,
} from '../controllers/parcel.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('customer', 'admin'), createParcel);
router.get('/my-parcels', authorize('customer'), getMyParcels);

router.get('/track/:trackingNumber', trackParcel);
router.get('/metrics', getParcelMetrics);
router.get('/', getParcels);
router.get('/:id', getParcel);
router.put('/:id/status', authorize('agent', 'admin'), updateParcelStatus);

export default router;