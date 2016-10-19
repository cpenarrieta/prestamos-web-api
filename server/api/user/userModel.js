const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String },
  celular: { type: String },
  ubigeo: { type: String },
  apellidos: { type: String },
  nombre: { type: String },
  fechaEmision: { type: Date },
  fechaNacimiento: { type: Date },
  bankRates: [{
    bank: { type: Schema.Types.ObjectId, ref: 'bank' },
    solesMaxAmount: Number,
    dollarMaxAmount: Number,
    segmentation: String,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', UserSchema);
