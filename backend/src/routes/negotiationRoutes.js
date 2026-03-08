const express = require('express');
const router = express.Router();
const { startNegotiation, getNegotiationHistory } = require('../controllers/negotiationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/start', protect, authorize('SHIPPER', 'ADMIN'), startNegotiation);
router.get('/history', protect, getNegotiationHistory);

module.exports = router;
