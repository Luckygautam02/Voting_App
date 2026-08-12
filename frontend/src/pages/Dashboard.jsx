import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // State to store user role
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        // Fetch user profile to get name and role
        const profileRes = await axios.get(
          "http://15.206.185.215:8080/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setUserName(profileRes.data.user.name);
        setUserRole(profileRes.data.user.role);

        // Fetch candidate list
        const candidateRes = await axios.get(
          "http://15.206.185.215:8080/api/candidate",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setCandidates(candidateRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setErrorMsg("Failed to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleVote = async (candidateId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://15.206.185.215:8080/api/candidate/vote/${candidateId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert(response.data.message || "Vote recorded successfully!");
    } catch (err) {
      console.error("Vote Error:", err);
      if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Error recording vote. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-violet-900 p-6 font-sans text-white">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold">Voting Dashboard</h2>
            {userName && (
              <p className="text-sm text-purple-300 mt-1 flex items-center gap-2">
                Welcome,{" "}
                <span className="font-semibold text-white">{userName}</span>
                {userRole === "admin" && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-[10px] uppercase font-bold rounded-full border border-red-500/50">
                    Admin
                  </span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex justify-center gap-4 mb-6">
          <Link
            to="/results"
            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-all shadow-md text-sm"
          >
            View Results
          </Link>
          {/* New Settings Button */}
          <Link
            to="/settings"
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all shadow-md text-sm"
          >
            Settings
          </Link>

          {userRole === "admin" && (
            <Link
              to="/admin"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md text-sm"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Heading based on role */}
        <h3 className="text-lg font-semibold text-gray-200 mb-4 text-center">
          {userRole === "admin"
            ? "Candidate List"
            : "Select a Candidate to Vote"}
        </h3>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4 text-center text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center backdrop-blur-md shadow-lg"
              >
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {candidate.name}
                  </h4>
                  <p className="text-sm text-gray-300">
                    Party: {candidate.party}
                  </p>
                </div>

                {/* 🔴 MAGIC HAPPENS HERE: Show Vote button ONLY if user is NOT an admin */}
                {userRole !== "admin" && (
                  <button
                    onClick={() => handleVote(candidate._id)}
                    className="px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95"
                  >
                    Vote
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300 py-6">
              Loading candidates or no candidates found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
