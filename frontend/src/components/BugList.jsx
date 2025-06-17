import { useState, useEffect } from "react";

const BugList = ({
  bugs,
  onEdit,
  onDelete,
  onStatusChange,
  onRegenerateTags,
  loading,
  allTags = [],
}) => {
  const [filteredBugs, setFilteredBugs] = useState(bugs);
  const [filters, setFilters] = useState({
    status: "",
    severity: "",
    search: "",
    tags: "",
  });

  useEffect(() => {
    let filtered = bugs;

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((bug) => bug.status === filters.status);
    }

    // Apply severity filter
    if (filters.severity) {
      filtered = filtered.filter((bug) => bug.severity === filters.severity);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (bug) =>
          bug.title.toLowerCase().includes(searchTerm) ||
          bug.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply tags filter
    if (filters.tags) {
      const selectedTags = filters.tags.split(",").map((tag) => tag.trim());
      filtered = filtered.filter(
        (bug) => bug.tags && bug.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    setFilteredBugs(filtered);
  }, [bugs, filters]);

  const getSeverityColor = (severity) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800",
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      Open: "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      Resolved: "bg-green-100 text-green-800",
      Closed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading bugs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search bugs..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange("severity", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <select
              value={filters.tags}
              onChange={(e) => handleFilterChange("tags", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({ status: "", severity: "", search: "", tags: "" })
              }
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bug List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredBugs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No bugs found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBugs.map((bug) => (
                  <tr key={bug._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {bug.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {bug.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {bug.tags && bug.tags.length > 0 ? (
                          bug.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No tags</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
                          bug.severity
                        )}`}
                      >
                        {bug.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={bug.status}
                        onChange={(e) =>
                          onStatusChange(bug._id, e.target.value)
                        }
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(
                          bug.status
                        )}`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {bug.assignedTo ? bug.assignedTo.username : "Unassigned"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {bug.reportedBy.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(bug.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(bug)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            onRegenerateTags && onRegenerateTags(bug._id)
                          }
                          className="text-green-600 hover:text-green-900 cursor-pointer p-2 rounded-md bg-green-100 hover:bg-green-200 transition-colors"
                          title="Regenerate Tags"
                        >
                          Add Tags
                        </button>
                        <button
                          onClick={() => onDelete(bug._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugList;
