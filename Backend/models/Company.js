// backend/models/Company.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  phone: String,
  description: String,
  logo: String,
  images: [String]
});

export default mongoose.model('Company', companySchema);
