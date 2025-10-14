import express from "express";
import Payslip from "../models/Payslip.js";

const router = express.Router();

// Create new payslip
router.post("/", async (req, res) => {
  try {
    const newPayslip = new Payslip(req.body);
    await newPayslip.save();
    res.status(201).json(newPayslip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all payslips for an employee
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const payslips = await Payslip.find({ employeeId });
    res.json(payslips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single payslip by ID
router.get("/single/:id", async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id);
    res.json(payslip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
