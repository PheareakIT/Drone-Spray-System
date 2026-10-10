const express = require('express');
const router = express.Router();
const sprayListController = require('../controllers/sprayListController');
const { protect, authorize } = require('../middleware/auth');

// Only admin and super can access spray list endpoints
router.use(protect, authorize('admin', 'super'));

router.post('/', sprayListController.createSpray);
router.get('/', sprayListController.getAllSprays);
router.get('/:id', sprayListController.getSprayById);
router.put('/:id', sprayListController.updateSpray);
router.delete('/:id', sprayListController.deleteSpray);

module.exports = router;
