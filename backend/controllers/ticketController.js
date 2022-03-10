const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//get tickets
const getTickets = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.find({ user: req.user.id });
  res.status(200).json({ status: 'Success', tickets });
});

//get ticket
const getTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(AppError('Ticket not found with this Id', 404));
  }

  if (ticket.user.toString() !== req.user.id) {
    return next(AppError('You are not allowed to access this ticket', 401));
  }
  res.status(200).json({ status: 'Success', ticket });
});

//create ticket
const createTicket = catchAsync(async (req, res, next) => {
  const { description, product } = req.body;

  if (!description || !product)
    return next(AppError('Please enter product and description', 422));

  const tickets = await Ticket.create({
    user: req.user.id,
    description,
    product,
    status: 'new',
  });

  res.status(201).json({
    status: 'Success',
    tickets,
    message: 'Ticket created successfully',
  });
});

//deleteTicket ticket
const deleteTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(AppError('Ticket not found with this Id', 404));
  }

  if (ticket.user.toString() !== req.user.id) {
    return next(AppError('You are not allowed to access this ticket', 401));
  }

  await ticket.remove();
  res
    .status(200)
    .json({ status: 'Success', message: 'Ticket deleted successfully' });
});

//updateTicket ticket
const updateTicket = catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findOne(req.params.id);

  if (!ticket) {
    return next(AppError('Ticket not found with this Id', 404));
  }

  if (ticket.user.toString() !== req.user.id) {
    return next(AppError('You are not allowed to access this ticket', 401));
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTicket);
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};
