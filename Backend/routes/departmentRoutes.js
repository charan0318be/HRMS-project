import express from "express";
import Department from "../models/Department.js";

const router = express.Router();

// ------------------- ADD Department -------------------
router.post("/add", async (req, res) => {
  try {
    const { name, description, head, branch, status } = req.body;

    const existing = await Department.findOne({ name });
    if (existing) return res.status(400).json({ message: "Department name already exists" });

    const dept = new Department({ name, description, head, branch, status });
    await dept.save();

    console.log("[DEBUG] Department added successfully:", dept);
    res.status(201).json(dept);
  } catch (err) {
    console.error("[ERROR] Add department failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------- GET All Departments -------------------
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching departments", error: err.message });
  }
});


// ------------------- UPDATE Department -------------------
router.put("/:id", async (req, res) => {
  try {
    const { name, description, head, branch, status } = req.body;

    const existing = await Department.findOne({ name, _id: { $ne: req.params.id } });
    if (existing) return res.status(400).json({ message: "Department name already exists" });

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, head, branch, status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Department not found" });

    console.log("[DEBUG] Department updated successfully:", updated);
    res.json(updated);
  } catch (err) {
    console.error("[ERROR] Update department failed:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------- ASSIGN Employees to Department -------------------
router.put("/assign/:id", async (req, res) => {
  try {
    const { employees } = req.body;
    if (!employees || !Array.isArray(employees)) {
      return res.status(400).json({ message: "Employees array required" });
    }

    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    employees.forEach((emp) => {
      if (!emp?.employeeId) return;

      const exists = department.employees.find(
        (e) => e.employeeId?.toString() === emp.employeeId
      );

      if (!exists) {
        department.employees.push({
          employeeId: emp.employeeId,
          role: emp.role || "Employee",
        });
      }
    });

    await department.save();

    const populatedDept = await Department.findById(req.params.id).populate({
      path: "employees.employeeId",
      select: "name email position",
    });

    console.log("[DEBUG] Employee assigned successfully:", populatedDept);
    res.status(200).json(populatedDept);
  } catch (err) {
    console.error("[ERROR] Assign employees failed:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// ------------------- DELETE Department -------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Department not found" });

    console.log("[DEBUG] Department deleted:", deleted._id);
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("[ERROR] Delete department failed:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
