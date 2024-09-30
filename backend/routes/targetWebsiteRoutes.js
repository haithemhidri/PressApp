import express from 'express';
import {
  getTargetWebsites,
  createTargetWebsite,
  updateTargetWebsite,
  deleteTargetWebsite,
} from '../controllers/targetWebsiteController.js';

const router = express.Router();

router.route('/').get(getTargetWebsites).post(createTargetWebsite);
router
  .route('/:id')
  .put(updateTargetWebsite)
  .delete(deleteTargetWebsite);

export default router;
