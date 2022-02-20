const express = require('express');
const colors = require('colors');
const config = require('dotenv').config({ path: './.env' });
const morgan = require('morgan');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

//db connection
const dataBasesConnection = require('./utils/db');
dataBasesConnection();

const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const globalErrorHandler = require('./middleware/globalErrorHnadler');
const app = express();

app.use(helmet());
//development server
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
//limit some api
const limiter = rateLimit({
  max: 200,
  windowMS: 60 * 6 * 1000,
  message: 'Too many request , please try again in an hour later.',
});
app.use('/api', limiter);
//reading data from body  into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
//data sanitization against nosql query injection
app.use(mongoSanitize());
//data sanitization against xss
app.use(xss());
//prevent params pollution
app.use(hpp()); //whitelist allows u to send two same fields for sorting
//serving static files
app.use(express.static(`${__dirname}/public`));

//Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tickets', ticketRoutes);

app.use('**', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port} ...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('uncaughtException ');
  server.close(() => {
    process.exit(1);
  });
});
