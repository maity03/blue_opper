const express = require('express');
const router = express.Router();
const { 
  getBugs, 
  getBug, 
  createBug, 
  updateBug, 
  deleteBug, 
  getUsers, 
  getBugStats,
  regenerateTags,
  getAllTags
} = require('../controllers/bugController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Bug CRUD routes
router.get('/', getBugs);
router.get('/stats', getBugStats);
router.get('/users', getUsers);
router.get('/tags', getAllTags);
router.get('/:id', getBug);
router.post('/', createBug);
router.put('/:id', updateBug);
router.delete('/:id', deleteBug);
router.post('/:id/regenerate-tags', regenerateTags);

module.exports = router; 