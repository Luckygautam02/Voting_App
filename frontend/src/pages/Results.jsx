import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch candidate votes using YOUR custom route
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        // Fetching data from your optimized vote count route
        const response = await axios.get(
          "http://15.206.185.215:8080/api/candidate/vote/count",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Since your backend already sorts the data, we just set it directly!
        setCandidates(response.data);
      } catch (err) {
        console.error("Error fetching results:", err);
        setErrorMsg("Failed to load voting results.");
      }
    };

    fetchResults();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-violet-900 p-6 font-sans text-white flex items-center justify-center">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold">Live Voting Results</h2>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-md text-sm"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4 text-center text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Results List */}
        <div className="flex flex-col gap-4">
          {candidates.length > 0 ? (
            candidates.map((candidate, index) => (
              // Using index as key since your backend map might not return _id
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-md shadow-lg flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-300">
                      #{index + 1}
                    </span>
                    {/* Displaying name and party from your backend response */}
                    <h4 className="text-lg font-bold text-white">
                      {candidate.name || "Unknown"}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    Party: {candidate.party}
                  </p>
                </div>

                {/* Vote Count Badge (using candidate.count as per your backend route) */}
                <div className="text-right">
                  <span className="text-xl font-extrabold text-pink-400">
                    {candidate.count || 0}
                  </span>
                  <p className="text-xs text-gray-400">Votes</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300 py-6">
              Loading results or no candidates found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
