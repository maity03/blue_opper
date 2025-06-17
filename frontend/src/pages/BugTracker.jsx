import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BugForm from "../components/BugForm";
import BugList from "../components/BugList";

const BugTracker = () => {
  const { user } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000/api/bugs";

  // Fetch bugs
  const fetchBugs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch bugs");

      const data = await response.json();
      setBugs(data.bugs || data);
    } catch (error) {
      setError("Failed to load bugs");
      console.error("Error fetching bugs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for assignment dropdown
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tags");

      const data = await response.json();
      setAllTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchBugs();
    fetchUsers();
    fetchTags();
  }, []);

  // Create or update bug
  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const url = editingBug ? `${API_BASE}/${editingBug._id}` : API_BASE;
      const method = editingBug ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save bug");
      }

      const savedBug = await response.json();

      if (editingBug) {
        setBugs((prev) =>
          prev.map((bug) => (bug._id === editingBug._id ? savedBug : bug))
        );
      } else {
        setBugs((prev) => [savedBug, ...prev]);
      }

      // Refresh tags after creating/updating a bug
      fetchTags();

      setShowForm(false);
      setEditingBug(null);
      setError("");
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete bug
  const handleDelete = async (bugId) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/${bugId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete bug");

      setBugs((prev) => prev.filter((bug) => bug._id !== bugId));
      setError("");
    } catch (error) {
      setError("Failed to delete bug");
      console.error("Error deleting bug:", error);
    }
  };

  // Update bug status
  const handleStatusChange = async (bugId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/${bugId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedBug = await response.json();
      setBugs((prev) =>
        prev.map((bug) => (bug._id === bugId ? updatedBug : bug))
      );
    } catch (error) {
      setError("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  // Regenerate tags for a bug
  const handleRegenerateTags = async (bugId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/${bugId}/regenerate-tags`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to regenerate tags");

      const updatedBug = await response.json();
      setBugs((prev) =>
        prev.map((bug) => (bug._id === bugId ? updatedBug : bug))
      );

      // Refresh tags after regenerating
      fetchTags();
    } catch (error) {
      setError("Failed to regenerate tags");
      console.error("Error regenerating tags:", error);
    }
  };

  // Edit bug
  const handleEdit = (bug) => {
    setEditingBug(bug);
    setShowForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingBug(null);
    setError("");
  };

  return (
    <div className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bug Tracker</h2>
            <p className="text-sm text-gray-600">
              Manage and track bug reports with AI-generated tags
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + New Bug
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Bug Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <BugForm
                bug={editingBug}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                users={users}
              />
            </div>
          </div>
        )}

        {/* Bug List */}
        <BugList
          bugs={bugs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onRegenerateTags={handleRegenerateTags}
          loading={loading}
          allTags={allTags}
        />
      </div>
    </div>
  );
};

export default BugTracker;
