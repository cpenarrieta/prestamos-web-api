const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const BankSchema = new Schema({
  name: { type: String, required: true, unique: true },
  username: String,
  password: String,
  rates: [{
    segmentation: String,
    max: Number,
    min: Number,
    solesRate: Number,
    dollarRate: Number,
  }],
  quotes: [{
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    code: String,
    totalAmount: Number,
    currency: String,
    monthlyFee: Number,
    createdAt: { type: Date, default: Date.now },
  }],
  loans: [{
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    code: String,
    totalAmount: Number,
    currency: String,
    monthlyFee: Number,
    status: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }],
  disabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

BankSchema.pre('save', function (next) { // eslint-disable-line
  if (!this.isModified('password')) {
    return next();
  }

  this.password = this.encryptPassword(this.password);
  next();
});

BankSchema.methods = {
  authenticate: function (plainTextPword) { // eslint-disable-line
    return bcrypt.compareSync(plainTextPword, this.password);
  },
  encryptPassword: function (plainTextPword) { // eslint-disable-line
    if (!plainTextPword) {
      return '';
    }
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainTextPword, salt);
  },
  toJson: function () { // eslint-disable-line
    const obj = this.toObject();
    delete obj.password;
    return obj;
  },
};

module.exports = mongoose.model('bank', BankSchema);
