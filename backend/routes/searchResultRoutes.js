import express from 'express';
import { saveSearchResult, getSearchResults } from '../controllers/searchResultController.js'; 

const router = express.Router();

router.post('/result', saveSearchResult);
router.get('/search-result', getSearchResults);

export default router;
