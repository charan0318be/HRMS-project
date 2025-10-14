import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProfile } from "./ProfileContext";

const AssetManagement = () => {
  const { role } = useProfile() || { role: "user" };
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    assetName: "",
    assetType: "",
    assignedTo: "",
    status: "Available",
  });

  // Fetch assets initially and whenever changes happen
  const fetchAssets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assets");
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssets();

    // Optional: Polling every 5 seconds for real-time updates for users
    const interval = setInterval(() => {
      fetchAssets();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/assets/add", newAsset);
      setNewAsset({ assetName: "", assetType: "", assignedTo: "", status: "Available" });
      fetchAssets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/assets/${id}`);
      fetchAssets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Asset Management</h2>

      {role === "admin" && (
        <form onSubmit={handleAddAsset} className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Asset Name"
            value={newAsset.assetName}
            onChange={(e) => setNewAsset({ ...newAsset, assetName: e.target.value })}
            className="border rounded p-2 w-60"
            required
          />
          <input
            type="text"
            placeholder="Asset Type"
            value={newAsset.assetType}
            onChange={(e) => setNewAsset({ ...newAsset, assetType: e.target.value })}
            className="border rounded p-2 w-60"
            required
          />
          <input
            type="text"
            placeholder="Assigned To"
            value={newAsset.assignedTo}
            onChange={(e) => setNewAsset({ ...newAsset, assignedTo: e.target.value })}
            className="border rounded p-2 w-60"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Asset</button>
        </form>
      )}

      <table className="w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Asset Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Assigned To</th>
            <th className="border p-2">Status</th>
            {role === "admin" && <th className="border p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id} className="text-center">
              <td className="border p-2">{asset.assetName}</td>
              <td className="border p-2">{asset.assetType}</td>
              <td className="border p-2">{asset.assignedTo}</td>
              <td className="border p-2">{asset.status}</td>
              {role === "admin" && (
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(asset._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetManagement;
