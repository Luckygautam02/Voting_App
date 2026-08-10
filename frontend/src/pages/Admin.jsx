import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Admin = () => {
  // States for form inputs
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [age, setAge] = useState("");

  // States for handling edit mode and candidate list
  const [candidates, setCandidates] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCandidateId, setEditCandidateId] = useState(null);

  // States for messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  // Function to fetch all candidates for the admin view
  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5001/candidate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(response.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  // Fetch candidates on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchCandidates();
  }, [navigate]);

  // Handle Create OR Update Candidate
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");

      if (isEditMode) {
        // PUT request to update existing candidate
        await axios.put(
          `http://localhost:5001/candidate/${editCandidateId}`,
          {
            name,
            party,
            age,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSuccessMsg("Candidate updated successfully!");
      } else {
        // POST request to create new candidate
        await axios.post(
          "http://localhost:5001/candidate",
          {
            name,
            party,
            age,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSuccessMsg("Candidate added successfully!");
      }

      // Reset form and states
      resetForm();
      // Refresh candidate list
      fetchCandidates();
    } catch (err) {
      console.error("Admin Error:", err);
      if (err.response && err.response.status === 403) {
        setErrorMsg("Access Denied: Only Admins can perform this action.");
      } else if (err.response && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg("Action failed. Please check backend logs.");
      }
    }
  };

  // Handle Edit Button Click
  const handleEditClick = (candidate) => {
    setName(candidate.name);
    setParty(candidate.party);
    setAge(candidate.age || ""); // Set to empty string if age is undefined in GET route
    setIsEditMode(true);
    setEditCandidateId(candidate._id);

    // Smooth scroll to top to show the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Delete Button Click
  const handleDeleteClick = async (candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/candidate/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg("Candidate deleted successfully!");
      fetchCandidates(); // Refresh list after deletion
    } catch (err) {
      console.error("Delete Error:", err);
      setErrorMsg("Failed to delete candidate.");
    }
  };

  // Helper function to reset form
  const resetForm = () => {
    setName("");
    setParty("");
    setAge("");
    setIsEditMode(false);
    setEditCandidateId(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-violet-900 p-6 font-sans text-white">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Form Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 h-fit">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-white mb-2">
              {isEditMode ? "Edit Candidate" : "Admin Panel"}
            </h2>
            <p className="text-gray-300 text-sm">
              {isEditMode
                ? "Update details of the selected candidate"
                : "Add a new candidate for the election"}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6 text-center text-sm font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded-lg mb-6 text-center text-sm font-medium">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                placeholder="Enter candidate name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Party Name
              </label>
              <input
                type="text"
                placeholder="Enter party name (e.g., BJP, AAP)"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Candidate Age
              </label>
              <input
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-95"
              >
                {isEditMode ? "Update Candidate" : "Add Candidate"}
              </button>

              {isEditMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg shadow-lg transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center border-t border-white/10 pt-4">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white text-sm font-semibold underline-offset-2 hover:underline transition-all"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Right Column: Manage Candidates List */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10 h-[600px] overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">
            Manage Candidates
          </h3>

          <div className="flex flex-col gap-4">
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="bg-gray-800/50 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <h4 className="text-lg font-bold text-purple-200">
                      {candidate.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Party: {candidate.party}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleEditClick(candidate)}
                      className="flex-1 sm:flex-none px-4 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500 hover:text-white rounded-md text-sm font-semibold transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(candidate._id)}
                      className="flex-1 sm:flex-none px-4 py-1.5 bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500 hover:text-white rounded-md text-sm font-semibold transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-10">
                No candidates available to manage.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
