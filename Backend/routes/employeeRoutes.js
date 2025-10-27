import express from "express";
import EmployeeModel from "../models/Employee.js";
import LeaveModel from "../models/LeaveModel.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// --- Get all employees ---
router.get("/", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
});

// --- Recent 5 employees ---
router.get("/recent", async (req, res) => {
  try {
    const recentEmployees = await EmployeeModel.find()
      .sort({ _id: -1 }) // sort by _id
      .limit(5)
      .lean();

    const formatted = recentEmployees.map(e => ({
      name: e.name,
      role: e.role || "Employee",
      date: e.createdAt ? e.createdAt.toISOString().split("T")[0] : "N/A",
      status: e.status || "New"
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent employees", error: err.message });
  }
});

// --- Search employees by name, ID, or department ---
router.get("/search/:key", async (req, res) => {
  try {
    const searchKey = req.params.key;
    const results = await EmployeeModel.find({
      $or: [
        { name: { $regex: searchKey, $options: "i" } },
        { employeeId: { $regex: searchKey, $options: "i" } },
        { department: { $regex: searchKey, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error searching employees", error: err.message });
  }
});

// --- Stats for dashboard ---
router.get("/stats", async (req, res) => {
  try {
    const totalEmployees = await EmployeeModel.countDocuments();
    const checkedIn = await Attendance.countDocuments({ status: "Present" });
    const onLeave = await LeaveModel.countDocuments({ status: "approved" });
    res.json({ totalEmployees, checkedIn, onLeave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch employee stats", error: err.message });
  }
});

// --- Get single employee (keep this last) ---
router.get("/:id", async (req, res) => {
  try {
    const emp = await EmployeeModel.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
});

// --- Update employee ---
router.put("/:id", async (req, res) => {
  try {
    const updated = await EmployeeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", error: err.message });
  }
});

export default router;
