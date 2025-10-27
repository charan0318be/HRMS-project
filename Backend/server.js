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
import employeeRoutes from "./routes/employeeRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import resignationRoutes from './routes/resignationRoutes.js'; 
import meetingRoutes from "./routes/meetingRoutes.js";
import { Server } from "socket.io";
import http from 'http'; 
import companyRoutes from './routes/company.js';


const app = express();
app.use(express.json());
app.use(cors());

// Attach Socket.IO instance to req




const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"]
  }
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log("⚡ New client connected: ", socket.id);

  // Example: listen for client event
  socket.on("sendNotification", (data) => {
    console.log("Received notification: ", data);
    // Broadcast to all connected clients
    io.emit("receiveNotification", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});


app.use("/api/assets", assetRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/resignations", resignationRoutes);
app.use("/api/meetings", meetingRoutes);
app.use('/company', companyRoutes);


app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' });

app.use("/attendance", attendanceRoutes);
app.use("/payslip", payslipRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);


mongoose.connect('mongodb://localhost:27017/employee')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

  
// Helper: update leave balance automatically
// -----------------------

async function updateLeaveBalance(employeeId, leaveType) {
  const totalDaysMapping = { Annual: 60, Sick: 15, Casual: 10 };

  // Convert string ID to ObjectId
  const empIdObj = new mongoose.Types.ObjectId(employeeId);

  // Aggregate total used days
  const usedDaysAgg = await LeaveModel.aggregate([
    { 
      $match: { 
        employeeId: empIdObj,
        leaveType, 
        status: "Approved" 
      } 
    },
    { 
      $group: { _id: null, totalUsed: { $sum: { $toInt: "$duration" } } } 
    }
  ]);

  const usedDays = usedDaysAgg.length ? usedDaysAgg[0].totalUsed : 0;

  // Find existing leave balance
  let balance = await LeaveBalance.findOne({ employeeId: empIdObj, leaveType });

  if (balance) {
    balance.totalDays = totalDaysMapping[leaveType] || 12;
    balance.usedDays = usedDays;
  } else {
    balance = new LeaveBalance({
      employeeId: empIdObj,
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

// Delete leave by ID
app.delete("/leave/:id", async (req, res) => {
  try {
    const leaveId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return res.status(400).json({ message: "Invalid leave ID" });
    }

    const leave = await LeaveModel.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    await LeaveModel.deleteOne({ _id: leaveId });

    // ✅ Update leave balance safely
    if (leave.employeeId && leave.leaveType) {
      try {
        await updateLeaveBalance(leave.employeeId, leave.leaveType);
      } catch (balanceErr) {
        console.error("Failed to update leave balance:", balanceErr);
      }
    }

    // ✅ Emit real-time delete event to all connected clients
    req.io.emit("leaveDeleted", { id: leaveId });

    res.json({ message: "Leave deleted successfully" });
  } catch (err) {
    console.error("Error deleting leave:", err);
    res.status(500).json({ message: "Error deleting leave", error: err.message });
  }
});

app.get("/recent", async (req, res) => {
  try {
    const recentLeaves = await LeaveModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("employeeId", "name")
      .lean();

    const formatted = recentLeaves.map(l => ({
      employeeName: l.employeeId?.name || "Unknown",
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate: l.endDate,
      status: l.status
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching recent leaves:", err);
    res.status(500).json({ message: "Failed to fetch recent leaves", error: err.message });
  }
});


// Recent Leaves - GET /api/leave/recent
app.get("/api/leave/recent", async (req, res) => {
  try {
    const recentLeaves = await LeaveModel.find()
      .sort({ createdAt: -1 })   // latest first
      .limit(5)
      .populate("employeeId", "name") // get employee name from ObjectId
      .lean();

    // Format response
    const formatted = recentLeaves.map(l => ({
      employeeName: l.employeeId?.name || "Unknown",
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate: l.endDate,
      status: l.status
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching recent leaves:", err);
    res.status(500).json({ message: "Failed to fetch recent leaves" });
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

app.put("/leave/:id/status", async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return res.status(400).json({ message: "Invalid leave ID" });
    }

    const updatedLeave = await LeaveModel.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!updatedLeave) return res.status(404).json({ message: "Leave not found" });

    res.json(updatedLeave);
  } catch (err) {
    console.error("Error updating leave status:", err);
    res.status(500).json({ message: "Error updating leave status", error: err });
  }
});


// Leave Apply Route
app.post("/leave/apply", upload.single('handoverFile'), async (req, res) => {
  console.log("=== Incoming leave apply request ===");
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const { employeeId, name, leaveType, startDate, endDate, duration, resumptionDate, reason } = req.body;

    const durationNum = Number(duration);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const resume = new Date(resumptionDate);


    // ✅ Validation: Required fields
    if (!employeeId || !name || !leaveType || !start || !end || !durationNum || !resume || !reason) {
  return res.status(400).json({ message: "All required fields must be filled and valid" });
}
    // ✅ Prepare leave data
    const leaveData = {
  employeeId: new mongoose.Types.ObjectId(employeeId),
  name,
  leaveType,
  startDate: start,
  endDate: end,
  duration: durationNum,
  resumptionDate: resume,
  reason,
  status: "Pending",
  handoverFile: req.file ? req.file.path : null,
};

const leave = new LeaveModel(leaveData);
await leave.save();

    // ✅ Update leave balance
    await updateLeaveBalance(leave.employeeId, leave.leaveType);


    

    // ✅ Admin notification
    const notif = new NotificationModel({
      userId: null,
      message: `${name} applied for ${leaveType} leave`,
      isRead: false
    });
    await notif.save();

    // ✅ Emit socket event for real-time update
    req.io.emit("leaveAdded", leave);

    res.status(201).json({ message: "Leave applied successfully", leave });

  } catch (err) {
    console.error("Error applying leave:", err);
    res.status(500).json({ message: "Error applying leave", error: err.message });
  }
});

// Get all notifications
app.get("/notifications", async (req, res) => {
  try {
    const notifications = await NotificationModel.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
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

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update employee by ID
app.put('/employees/:id', async (req, res) => {
  try {
    const updated = await EmployeeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get employee by ID
app.get('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }
    const employee = await EmployeeModel.findById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});




// Current route
app.get("/targets", async (req, res) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post("/targets", async (req, res) => {
  try {
    const { title, kpiWeight, description, employees, startDate, endDate } = req.body;

    // Wrap single employee into an array
    const employeesArray = Array.isArray(employees) 
      ? employees 
      : employees ? [employees] : [];

    const target = new Target({
      title,
      kpiWeight,
      description,
      employees: employeesArray,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    });

    await target.save();
    res.status(201).json(target);
  } catch (err) {
    console.error("Error creating target:", err);
    res.status(500).json({ message: err.message });
  }
});


// Update target progress
app.put("/targets/:id/progress", async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid target ID" });
    }

    const target = await Target.findById(id);
    if (!target) return res.status(404).json({ message: "Target not found" });

    target.progress = Number(progress);
    // Automatically mark as "Completed" if 100%
    if (target.progress === 100) target.status = "Completed";

    await target.save();

    res.json({ message: "Progress updated successfully", target });
  } catch (err) {
    console.error("Error updating target progress:", err);
    res.status(500).json({ message: "Error updating progress", error: err.message });
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


// Approve a target (Manager/Admin approval)
app.put("/targets/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { managerRemarks, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid target ID" });
    }

    const target = await Target.findById(id);
    if (!target) return res.status(404).json({ message: "Target not found" });

    target.status = "Approved";           // Marks the target as approved
    target.managerRemarks = managerRemarks || "";
    target.rating = rating || null;
    target.managerApprovedAt = new Date();

    await target.save();

    res.status(200).json({ message: "Target approved successfully", target });
  } catch (error) {
    console.error("Error approving target:", error);
    res.status(500).json({ message: "Error approving target", error: error.message });
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
server.listen(3001, () => {
  console.log('Server is running on port 3001 with Socket.IO'); 
});

