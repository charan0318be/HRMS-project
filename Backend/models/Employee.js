import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },

  // 👇 HRMS Details
  employeeId: { type: String, unique: true },
  department: { type: String, default: 'Information Technology' },
  designation: { type: String, default: 'System Administrator' },
  status: { type: String, default: 'Active' },
  joined: { type: Date, default: Date.now },
  dob: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
}, { timestamps: true });


// ✅ Auto-generate Employee ID before saving
employeeSchema.pre('save', async function (next) {
  if (!this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `EMP${(800 + count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

const EmployeeModel = mongoose.model('Employee', employeeSchema);
export default EmployeeModel;
