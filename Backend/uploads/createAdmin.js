import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import EmployeeModel from './models/Employee.js';

mongoose.connect('mongodb://localhost:27017/employee')
  .then(async () => {
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new EmployeeModel({
      name: 'Admin',
      email: 'admin@example.com',
      phonenumber: '1234567890',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin created successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
