import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AssetManagement = ({ isAdmin = true, activeTab, currentUserId }) => {
  const [submenu, setSubmenu] = useState("Asset"); // "AssetType" or "Asset"
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // add, edit, assign
  const [currentAsset, setCurrentAsset] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "",
    assignedTo: "",
    status: "Available",
    purchaseDate: "",
  });

  // ------------------ Fetch Data ------------------
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://hrms-project-1-eca3.onrender.com
/api/assets");
      let allAssets = res.data;
      console.log("[DEBUG] All fetched assets:", allAssets);

      // ✅ For user view, only show assets assigned to them
      if (!isAdmin && currentUserId) {
        allAssets = allAssets.filter((asset) => asset.assignedTo === currentUserId);
        console.log("[DEBUG] Filtered user assets:", allAssets);
      }

      setAssets(allAssets);
    } catch (err) {
      console.error("[ERROR] Fetching assets failed:", err);
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://hrms-project-1-eca3.onrender.com
/api/employees");
      console.log("[DEBUG] Fetched employees:", res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error("[ERROR] Fetching employees failed:", err);
    }
  };

  // ------------------ Handle activeTab ------------------
  useEffect(() => {
    if (!activeTab) return;
    const tab = activeTab.toLowerCase();
    if (tab.includes("asset") && tab.includes("type")) setSubmenu("AssetType");
    else if (tab.includes("asset")) setSubmenu("Asset");
  }, [activeTab]);

  // ------------------ Initial fetch ------------------
  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, []);

  // ------------------ Modal Handlers ------------------
  const openModal = (type, asset = null) => {
    setModalType(type);
    setCurrentAsset(asset || null);

    if (asset) {
      setFormData({
        assetName: asset.assetName || "",
        assetType: asset.assetType || "",
        assignedTo: asset.assignedTo || "",
        status: asset.status || "Available",
        purchaseDate: asset.purchaseDate
          ? asset.purchaseDate.slice(0, 10)
          : "",
      });
    } else {
      setFormData({
        assetName: "",
        assetType: "",
        assignedTo: "",
        status: "Available",
        purchaseDate: "",
      });
    }
    setShowModal(true);
  };

  // ------------------ Handle Form Submit ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { assetName, assetType, status, purchaseDate, assignedTo } = formData;

    if (!assetName.trim() || !assetType.trim()) {
      alert("Asset Name and Asset Type are required");
      return;
    }

    const payload = {
      assetName: assetName.trim(),
      assetType: assetType.trim(),
      status,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : Date.now(),
    };

    try {
      if (modalType === "add") {
        await axios.post("https://hrms-project-1-eca3.onrender.com
/api/assets/add", payload);
      } else if (modalType === "edit" && currentAsset?._id) {
        await axios.put(
          `https://hrms-project-1-eca3.onrender.com
/api/assets/${currentAsset._id}`,
          payload
        );
      } else if (modalType === "assign" && currentAsset?._id) {
        if (!assignedTo) {
          alert("Please select an employee");
          return;
        }
        await axios.put(
          `https://hrms-project-1-eca3.onrender.com
/api/assets/${currentAsset._id}`,
          { assignedTo, status: "Assigned" }
        );
        setSubmenu("Asset");
      }

      await fetchAssets();
      setShowModal(false);
    } catch (err) {
      console.error("[ERROR] Modal submit failed:", err);
    }
  };

  // ------------------ Handle Delete ------------------
  const handleDelete = async (assetId) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await axios.delete(`https://hrms-project-1-eca3.onrender.com
/api/assets/${assetId}`);
      fetchAssets();
    } catch (err) {
      console.error("[ERROR] Delete failed:", err);
    }
  };

  // ------------------ Render Table ------------------
  const renderTable = () => {
    const isAssetType = submenu === "AssetType";

    return (
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isAssetType ? "Asset Types" : "Assets"}
        </h2>

        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => openModal("add")}
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2"
            >
              <FaPlus /> Add Asset
            </button>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white rounded shadow divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {isAssetType ? (
                  <>
                    <th className="px-4 py-2 text-left">Asset Type</th>
                    <th className="px-4 py-2 text-left">Asset Name</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Date</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-2 text-left">Asset Name</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Assigned To</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Date</th>
                    {isAdmin && <th className="px-4 py-2 text-center">Actions</th>}
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No assets found
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr key={asset._id}>
                    {isAssetType ? (
                      <>
                        <td className="px-4 py-2">{asset.assetType}</td>
                        <td className="px-4 py-2">{asset.assetName}</td>
                        <td className="px-4 py-2 text-center">{asset.status}</td>
                        <td className="px-4 py-2 text-center">
                          {asset.purchaseDate
                            ? new Date(asset.purchaseDate).toLocaleDateString()
                            : "-"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">{asset.assetName}</td>
                        <td className="px-4 py-2">{asset.assetType}</td>
                        <td className="px-4 py-2">
                          {employees.find((e) => e._id === asset.assignedTo)?.name || "-"}
                        </td>
                        <td className="px-4 py-2 text-center">{asset.status}</td>
                        <td className="px-4 py-2 text-center">
                          {asset.purchaseDate
                            ? new Date(asset.purchaseDate).toLocaleDateString()
                            : "-"}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-2 text-center">
                            <div className="inline-flex gap-2 justify-center w-full">
                              <button onClick={() => openModal("assign", asset)}>
                                <FaPlus className="text-green-600 hover:text-green-800" />
                              </button>
                              <button onClick={() => openModal("edit", asset)}>
                                <FaEdit className="text-blue-600 hover:text-blue-800" />
                              </button>
                              <button onClick={() => handleDelete(asset._id)}>
                                <FaTrash className="text-red-600 hover:text-red-800" />
                              </button>
                            </div>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  // ------------------ Render Component ------------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {renderTable()}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4 capitalize">{modalType} Asset</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {(modalType === "add" || modalType === "edit") && (
                <>
                  <div>
                    <label>Asset Name</label>
                    <input
                      type="text"
                      required
                      value={formData.assetName}
                      onChange={(e) =>
                        setFormData({ ...formData, assetName: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                  <div>
                    <label>Asset Type</label>
                    <input
                      type="text"
                      required
                      value={formData.assetType}
                      onChange={(e) =>
                        setFormData({ ...formData, assetType: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                  <div>
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label>Purchase Date</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        setFormData({ ...formData, purchaseDate: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                </>
              )}

              {modalType === "assign" && (
                <>
                  <div>
                    <label>Asset Type</label>
                    <input
                      type="text"
                      value={formData.assetType}
                      disabled
                      className="w-full border px-2 py-1 rounded bg-gray-200"
                    />
                  </div>
                  <div>
                    <label>Select Employee</label>
                    <select
                      required
                      value={formData.assignedTo}
                      onChange={(e) =>
                        setFormData({ ...formData, assignedTo: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="">-- Select Employee --</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;
