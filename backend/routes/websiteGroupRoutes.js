import express from 'express';
import {
  getWebsiteGroups,
  createWebsiteGroup,
  updateWebsiteGroup,
  deleteWebsiteGroup,
} from '../controllers/websiteGroupController.js';

const router = express.Router();

router.route('/').get(getWebsiteGroups).post(createWebsiteGroup);
router.route('/:id').put(updateWebsiteGroup).delete(deleteWebsiteGroup);

export default router;
