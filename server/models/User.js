const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to fetch user by ID and return username
UserSchema.statics.getUsernameById = async function (userId) {
  try {
    const user = await this.findById(userId).select('username'); // Only return username
    if (!user) throw new Error('User not found');
    return user.username;
  } catch (error) {
    throw new Error('Error fetching username: ' + error.message);
  }
};

module.exports = mongoose.model('User', UserSchema);
