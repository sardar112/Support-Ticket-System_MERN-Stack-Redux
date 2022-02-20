const express = require('express');
const router = express.Router();

const { protect } = require('../controllers/authController');
const {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
} = require('../controllers/ticketController');

router.use(protect);

router.route('/').get(getTickets).post(createTicket);
router.route('/:id').get(getTicket).patch(updateTicket).delete(deleteTicket);

module.exports = router;
