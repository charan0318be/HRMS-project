import React, { useState, useEffect } from "react";
import axios from "axios";

const TakeAppraisal = ({ isAdmin = false, onUpdate }) => {
  const [targets, setTargets] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});
  const [adminSaved, setAdminSaved] = useState({});

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const employeeAliasMap = {
    emp1: "68c91b2abf0504db0635075d",
    emp2: "anotherUserId",
    emp3: "Suresh",
  };

  // ==================== FETCH TARGETS & APPRAISALS ====================
  useEffect(() => {
    let mounted = true;

    const fetchTargets = async () => {
      console.log("[DEBUG] Fetching targets...");
      try {
        const res = await axios.get("http://localhost:3001/targets");
        if (!userId || !userName) return setTargets([]);

        const assignedTargets = res.data.filter((t) => {
          if (!t.employees) return false;
          const flatEmployees = t.employees
            .flat(Infinity)
            .map((e) => e.split(","))
            .flat()
            .map((e) => e.trim());
          return isAdmin || flatEmployees.some((alias) => {
            const resolved = employeeAliasMap[alias] || alias;
            return resolved === userId || resolved === userName;
          });
        });

        if (mounted) {
          console.log("[DEBUG] Targets assigned to user/admin:", assignedTargets);
          setTargets(assignedTargets);
        }
      } catch (err) {
        console.error("[ERROR] Error fetching targets:", err);
      }
    };

    const fetchAppraisals = async () => {
      console.log("[DEBUG] Fetching appraisals...");
      try {
        const res = await axios.get("http://localhost:3001/appraisals");
        const normalized = res.data.map((a) => ({
          ...a,
          targetId: String(a.targetId?._id || a.targetId),
          submittedAt: a.submittedAt ? a.submittedAt.split("T")[0] : null,
        }));

        if (mounted) {
          const filtered = isAdmin
            ? normalized
            : normalized.filter((a) => String(a.employeeId) === String(userId));
          console.log("[DEBUG] Appraisals loaded:", filtered);
          setAppraisals(filtered);
        }
      } catch (err) {
        console.error("[ERROR] Error fetching appraisals:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTargets();
    fetchAppraisals();

    return () => { mounted = false; };
  }, [userId, userName, isAdmin]);

  // ==================== INPUT HANDLERS ====================
  const handleInputChange = (targetId, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [targetId]: { ...prev[targetId], [field]: value },
    }));
    console.log(`[DEBUG] Input changed for ${targetId}: ${field} = ${value}`);
  };

  const handleSubmit = async (targetId) => {
    const { score, feedback } = inputs[targetId] || {};
    if (!score || !feedback) {
      alert("❌ Please enter both score and feedback.");
      return;
    }

    if (submitting[targetId]) return;
    setSubmitting((prev) => ({ ...prev, [targetId]: true }));
    console.log(`[DEBUG] Submitting appraisal for target ${targetId}...`);

    try {
      const res = await axios.post("http://localhost:3001/appraisals", {
        employeeId: userId,
        targetId,
        score,
        feedback,
        status: "submitted",
        submittedAt: new Date(),
      });
      console.log("[DEBUG] Appraisal submitted:", res.data);

      setAppraisals((prev) => [...prev, res.data]);
      if (typeof onUpdate === "function") onUpdate();
    } catch (err) {
      console.error("[ERROR] Failed to submit appraisal:", err);
      if (err.response?.status === 400 && err.response.data?.message === "Appraisal already submitted") {
        alert("❌ You have already submitted this appraisal.");
      } else {
        alert("❌ Failed to submit appraisal.");
      }
    } finally {
      setSubmitting((prev) => ({ ...prev, [targetId]: false }));
    }
  };

  if (loading) return <div className="p-6 text-center">Loading targets...</div>;

  // ==================== RENDER ====================
  return (
    <div className="p-6 bg-gradient-to-br  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black text-center">
        {isAdmin ? " Submitted Appraisals" : "📋 Take Appraisal"}
      </h1>

      {targets.length === 0 ? (
        <div className="text-gray-600 text-center">
          <p>{isAdmin ? "No appraisals submitted yet." : "No KPI targets assigned to you yet."}</p>
        </div>
      ) : (
        targets.map((target) => {
          const resolvedTargetId = String(target._id);
          const targetAppraisals = appraisals.filter((a) => a.targetId === resolvedTargetId);
          const hasSubmitted = targetAppraisals.some((a) => String(a.employeeId) === String(userId));
          const adminLocked = targetAppraisals.some((a) => a.status === "approved" || a.adminRemarks);

          return (
            <div key={target._id} className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{target.title}</h2>
              <p className="text-gray-600 mb-4">{target.description}</p>

              {/* ==================== USER FORM ==================== */}
              {!isAdmin && (
                <div className="flex flex-col space-y-4">
                  {hasSubmitted && (
                    <p className="text-red-600 font-semibold mb-2">❌ You have already submitted this appraisal.</p>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                    <input
                      type="number"
                      placeholder="Enter score"
                      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={inputs[target._id]?.score || ""}
                      onChange={(e) => handleInputChange(target._id, "score", e.target.value)}
                      disabled={hasSubmitted || adminLocked}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                    <textarea
                      placeholder="Write your feedback..."
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={inputs[target._id]?.feedback || ""}
                      onChange={(e) => handleInputChange(target._id, "feedback", e.target.value)}
                      disabled={hasSubmitted || adminLocked}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit(target._id)}
                    disabled={hasSubmitted || submitting[target._id] || adminLocked}
                    className={`self-start px-5 py-2 font-semibold rounded-md shadow ${
                      hasSubmitted || submitting[target._id] || adminLocked
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    ✅ Submit Appraisal
                  </button>
                </div>
              )}

              {/* ==================== ADMIN VIEW ==================== */}
              {isAdmin && targetAppraisals.length > 0 && targetAppraisals.map((a) => (
                <div key={a._id} className="text-gray-700 space-y-2 mb-4 border-b pb-4">
                  <p><strong>Employee ID:</strong> {a.employeeId}</p>
                  <p><strong>Score:</strong> {a.score}</p>
                  <p><strong>Feedback:</strong> {a.feedback}</p>
                  <p className="text-sm text-gray-500">Submitted on: {a.submittedAt || "N/A"}</p>

                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Assign Task / Score"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={a.assignedTask || ""}
                      onChange={(e) =>
                        setAppraisals((prev) =>
                          prev.map((item) =>
                            item._id === a._id ? { ...item, assignedTask: e.target.value } : item
                          )
                        )
                      }
                      disabled={adminSaved[a._id] || a.status === "approved"}
                    />
                    <textarea
                      placeholder="Enter admin feedback..."
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={a.adminRemarks || ""}
                      onChange={(e) =>
                        setAppraisals((prev) =>
                          prev.map((item) =>
                            item._id === a._id ? { ...item, adminRemarks: e.target.value } : item
                          )
                        )
                      }
                      disabled={adminSaved[a._id] || a.status === "approved"}
                    />
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={a.status || "submitted"}
                      onChange={(e) =>
                        setAppraisals((prev) =>
                          prev.map((item) =>
                            item._id === a._id ? { ...item, status: e.target.value } : item
                          )
                        )
                      }
                      disabled={adminSaved[a._id] || a.status === "approved"}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="needs improvement">Needs Improvement</option>
                    </select>
                    <button
                      className={`px-4 py-2 font-semibold rounded-md ${
                        adminSaved[a._id] || a.status === "approved"
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      disabled={adminSaved[a._id] || a.status === "approved"}
                      onClick={async () => {
                        if (!a.assignedTask && !a.adminRemarks) {
                          alert("❌ Please enter at least assigned task or feedback.");
                          return;
                        }
                        try {
                          console.log("[DEBUG] Saving admin feedback for appraisal:", a._id);
                          await axios.put(`http://localhost:3001/appraisals/${a._id}`, {
                            adminRemarks: a.adminRemarks,
                            assignedTask: a.assignedTask,
                            status: a.status,
                          });
                          alert("✅ Admin feedback and status saved!");
                          setAdminSaved(prev => ({ ...prev, [a._id]: true }));
                          if (typeof onUpdate === "function") onUpdate();
                        } catch (err) {
                          console.error("[ERROR] Failed to save admin feedback:", err);
                          alert("❌ Failed to save feedback.");
                        }
                      }}
                    >
                      💾 Save Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TakeAppraisal;
