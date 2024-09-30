// routes/searchConfigurationRoutes.js
import express from 'express';
import {
  getSearchConfigurations,
  createSearchConfiguration,
  updateSearchConfiguration,
  deleteSearchConfiguration
} from '../controllers/searchConfigurationController.js';

const router = express.Router();

router.get('/', getSearchConfigurations);
router.post('/', createSearchConfiguration);
router.put('/:id', updateSearchConfiguration);
router.delete('/:id', deleteSearchConfiguration);

export default router;
