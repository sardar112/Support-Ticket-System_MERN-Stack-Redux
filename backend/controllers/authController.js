const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { signToken } = require('../utils/jwtfunctions');

//Register a new user
const signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) return next(new AppError(`User already exist  `, 400));
  const newUser = await User.create(req.body);
  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: signToken(newUser._id),
    });
  } else {
    return next(new AppError(`Invalid User Data  `, 422));
  }
});

//Login a user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide a email and password', 422));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  res.status(200).json({
    status: 'Success',
    _id: user._id,
    name: user.name,
    email: user.email,
    token: signToken(user._id),
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  let currentUser;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new AppError('You are not logged in', 401));
    }
    // const decod = jwt.verify(token, process.env.JWT_SECRET);
    //verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //check if user exists

    currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('user belonging to this token does not exist', 401)
      );
    }
  }
  //Grant access to protected  routes
  req.user = currentUser;
  next();
});

const me = catchAsync(async (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      status: 'Success',
      data: req.user,
    });
  }
});

module.exports = { signup, login, me, protect };
