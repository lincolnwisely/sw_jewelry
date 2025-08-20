const mongoose = require('mongoose');
const validate = require('validator');



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
    validate: [validate.isEmail, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
  },
  role: {
    type: String,
  },

});

module.exports = mongoose.model('User', userSchema);
