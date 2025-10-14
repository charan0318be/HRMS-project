// backend/routes/company.js
import express from 'express';
import multer from 'multer';
import Company from '../models/Company.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET company profile
router.get('/', async (req, res) => {
  try {
    const company = await Company.findOne(); // assuming only 1 company
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST update company profile
router.post('/', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    let company = await Company.findOne();
    if (!company) company = new Company({});

    company.name = req.body.name;
    company.address = req.body.address;
    company.email = req.body.email;
    company.phone = req.body.phone;
    company.description = req.body.description;

    if (req.files.logo) company.logo = `/uploads/${req.files.logo[0].filename}`;
    if (req.files.images) company.images = req.files.images.map(f => `/uploads/${f.filename}`);

    await company.save();
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
