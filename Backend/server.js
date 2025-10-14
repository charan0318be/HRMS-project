import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import EmployeeModel from './models/Employee.js';
import LeaveModel from './models/LeaveModel.js';
import NotificationModel from './models/NotificationModel.js';
import LeaveBalance from './models/LeaveBalance.js';
import multer from "multer";
import Appraisal from './models/Appraisal.js';
import Target from './models/Target.js';
import attendanceRoutes from "./routes/attendance.js";
import payslipRoutes from "./routes/payslip.js";
import assetRoutes from "./routes/assetRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";












const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/assets", assetRoutes);
app.use("/api/trips", tripRoutes);

app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' });

app.use('/uploads', express.static('uploads'));
app.use("/attendance", attendanceRoutes);
app.use("/payslip", payslipRoutes);

mongoose.connect('mongodb://localhost:27017/employee')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

  
// Helper: update leave balance automatically
// -----------------------

async function updateLeaveBalance(employeeId, leaveType) {
  const totalDaysMapping = { Annual: 60, Sick: 15, Casual: 10 }; // correct totals

  const usedDaysAgg = await LeaveModel.aggregate([
    { 
      $match: { 
        employeeId: mongoose.Types.ObjectId(employeeId), 
        leaveType, 
        status: "Approved" 
      } 
    },
    { 
      $group: { _id: null, totalUsed: { $sum: { $toInt: "$duration" } } } 
    }
  ]);

  const usedDays = usedDaysAgg.length ? usedDaysAgg[0].totalUsed : 0;

  let balance = await LeaveBalance.findOne({ employeeId, leaveType });

  if (balance) {
    balance.totalDays = totalDaysMapping[leaveType] || 12;
    balance.usedDays = usedDays;
  } else {
    balance = new LeaveBalance({
      employeeId,
      leaveType,
      totalDays: totalDaysMapping[leaveType] || 12,
      usedDays
    });
  }

  await balance.save();
}

 
// ----------------------
// REGISTER
// ----------------------
app.post('/register', async (req, res) => {
  try {
    const { name, email, phonenumber, password, confirmpassword, role } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new EmployeeModel({
      name,
      email,
      phonenumber,
      password: hashedPassword,
      role: role || 'user'
    });

    await newEmployee.save();
    res.status(201).json({ message: "Registered successfully", employee: newEmployee });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error });
  }
});

// ----------------------
// LOGIN
// ----------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "No record existing" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password is incorrect" });

    res.json({
      message: "success",
      role: user.role,
      userId: user._id.toString(),
      name: user.name 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error });
  }
});

app.get("/leave/all", async (req, res) => {
  try {
    const leaves = await LeaveModel.find().populate("employeeId", "name email");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaves", error: err });
  }
});

app.get("/leave/user/:id", async (req, res) => {
  try {
    const leaves = await LeaveModel.find({ employeeId: req.params.id });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user leaves", error: err });
  }
});

app.put("/leave/:id", upload.single('handoverFile'), async (req, res) => {
  try {
    const leaveId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return res.status(400).json({ message: "Invalid leave ID" });
    }

    const data = { ...req.body };
    if (req.file) data.handoverFile = req.file.path;

    const updatedLeave = await LeaveModel.findByIdAndUpdate(leaveId, data, { new: true });

    if (!updatedLeave) return res.status(404).json({ message: "Leave not found" });

    res.json({ message: "Leave updated", leave: updatedLeave });
  } catch (err) {
    console.error("Error updating leave:", err);
    res.status(500).json({ message: "Error updating leave", error: err });
  }
});

app.post("/leave/apply", upload.single('handoverFile'), async (req, res) => {
  console.log("=== Incoming leave apply request ===");
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const data = {
      ...req.body,
      handoverFile: req.file ? req.file.path : null
    };

    // REMOVE _id if present (important when editing)
    if (data._id) delete data._id;

    const leave = new LeaveModel({
  employeeId: new mongoose.Types.ObjectId(req.body.employeeId), // ✅ Convert string to ObjectId
  name: req.body.name,
  leaveType: req.body.leaveType,
  startDate: req.body.startDate,
  endDate: req.body.endDate,
  duration: req.body.duration,
  resumptionDate: req.body.resumptionDate,
  reason: req.body.reason,
  reliefOfficer: req.body.reliefOfficer,
  status: "Pending",
  handoverFile: req.file ? req.file.path : null,
});

await leave.save();
// --- update leave balance automatically ---
await updateLeaveBalance(leave.employeeId, leave.leaveType);


    // create admin notification
    // ✅ create admin notification (userId: null = admin)
const notif = new NotificationModel({
  userId: null,
  message: `${data.name} applied for ${data.leaveType} leave`,
  isRead: false
});
await notif.save();


    res.json({ message: "Leave applied", leave });
  } catch (err) {
    console.error("Error applying leave:", err);
    res.status(500).json({ message: "Error applying leave", error: err });
  }
});

app.get("/notifications", async (req, res) => {
  try {
    const notifications = await NotificationModel.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err });
  }
});

app.put("/notifications/:id/read", async (req, res) => {
  try {
    const notif = await NotificationModel.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: "Error updating notification", error: err });
  }
});

app.put('/notifications/read-admin', async (req, res) => {
  try {
    await NotificationModel.updateMany(
      { userId: null, isRead: false }, // admin notifications that are unread
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: 'Admin notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: "Error marking admin notifications as read", error: err });
  }
});

app.put("/leave/:id/status", async (req, res) => {
  try {
    const leave = await LeaveModel.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = req.body.status;
    await leave.save();

    if (req.body.status === "Approved") {
      const employeeId = new mongoose.Types.ObjectId(leave.employeeId);
      const duration = parseInt(leave.duration) || 1;

      let balance = await LeaveBalance.findOne({
        employeeId,
        leaveType: leave.leaveType,
      });

      // --- update leave balance automatically ---
      await updateLeaveBalance(leave.employeeId, leave.leaveType);
    }

    // Notification for user
    const notif = new NotificationModel({
      userId: leave.employeeId,
      message: `Your leave was ${leave.status}`,
    });
    await notif.save();

    res.json({ message: "Leave status updated successfully", leave });
  } catch (err) {
    console.error("Error updating leave status:", err);
    res.status(500).json({ message: "Error updating leave status", error: err });
  }
});



app.get("/leave/balance/:employeeId", async (req, res) => {
  try {
    const balances = await LeaveBalance.find({ employeeId: req.params.employeeId });
    const available = balances.map(l => ({
      type: l.leaveType,
      available: l.totalDays - l.usedDays
    }));
    res.json(available);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leave balance", error: err });
  }
});







app.post("/targets", async (req, res) => {
  try {
    const { title, kpiWeight, description, employees, startDate, endDate } = req.body;

    // Convert employees from comma-separated string to array
    const employeesArray = employees
      ? employees.split(",").map(e => e.trim()) 
      : [];

    const target = new Target({
      title,
      kpiWeight,
      description,
      employees: employeesArray,
      startDate,
      endDate
    });

    await target.save();
    res.status(201).json(target);
  } catch (err) {
    console.error("Error creating target:", err);
    res.status(500).json({ message: err.message });
  }
});
app.get("/targets", async (req, res) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/appraisals", async (req, res) => {
  try {
    const { targetId, employeeId, score, feedback } = req.body;
    if (!targetId || !employeeId || !score || !feedback)
      return res.status(400).json({ message: "All fields are required" });

    // Prevent duplicate submission
    const existing = await Appraisal.findOne({ targetId, employeeId });
    if (existing) return res.status(400).json({ message: "Appraisal already submitted" });

    const appraisal = new Appraisal({
      targetId,
      employeeId,
      score,
      feedback,
      status: "submitted",
      submittedAt: new Date()
    });

    await appraisal.save();
    const savedAppraisal = await Appraisal.findById(appraisal._id).populate("targetId", "title description");
    res.status(201).json(savedAppraisal);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});
app.get("/appraisals", async (req, res) => {
  try {
    const appraisals = await Appraisal.find()
      .populate("targetId", "title description")
      .sort({ createdAt: -1 });

    res.json(appraisals);
  } catch (err) {
    console.error("Error fetching appraisals:", err);
    res.status(500).json({ message: "Error fetching appraisals", error: err });
  }
});
app.put("/appraisals/:id", async (req, res) => {
  try {
    const { adminRemarks, status, score, assignedTask } = req.body;

    // Collect updates dynamically
    const updates = {
      ...(adminRemarks !== undefined ? { adminRemarks } : {}),
      ...(assignedTask !== undefined ? { assignedTask } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(score !== undefined ? { score } : {}),
    };

    // ✅ Once admin gives feedback or approves, lock it
    if (adminRemarks || assignedTask || status === "approved") {
      updates.isAdminFinalized = true; // prevent further edits
    }

    // Update the appraisal document
    const updated = await Appraisal.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appraisal not found" });
    }

    // ✅ When appraisal is approved, send notification & top performer logic
    if (String(status).toLowerCase() === "approved") {
      const employeeId = updated.employeeId;
      const topPerformer = score >= 90; // threshold for "Top Performer"

      // Create a notification for the employee
      await NotificationModel.create({
        employeeId,
        message: topPerformer
          ? "🎉 Congratulations! You’ve been recognized as a Top Performer!"
          : "✅ Your appraisal has been approved by Admin.",
        date: new Date(),
      });
    }

    // ✅ Respond with updated document
    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update appraisal:", err);
    res
      .status(500)
      .json({ message: "Failed to update appraisal", error: err.message });
  }
});



// ----------------------
// START SERVER
// ----------------------
app.listen(3001, () => {
  console.log('Server is running on port 3001'); 
});
