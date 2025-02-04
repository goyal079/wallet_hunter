import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../config/axios";
import MembersFilter from "../components/MembersFilter";
import { downloadCSV } from "../utils/csvExport";

function MembersList() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [filters, setFilters] = useState({});
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchMembers(1, filters);
  }, [filters]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = members.filter(
      (member) =>
        member.name?.toLowerCase().includes(searchTermLower) ||
        member.mobile1?.includes(searchTerm) ||
        member.mobile2?.includes(searchTerm)
    );

    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  const fetchMembers = async (page, currentFilters = {}) => {
    try {
      setLoading(true);

      // Build query parameters exactly as backend expects
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10", // Default limit as per backend
        ...(currentFilters.samaj && { samaj: currentFilters.samaj }),
        ...(currentFilters.gender && { gender: currentFilters.gender }),
        ...(currentFilters.maritalStatus && {
          maritalStatus: currentFilters.maritalStatus,
        }),
        ...(currentFilters.ageMin && { ageMin: currentFilters.ageMin }),
        ...(currentFilters.ageMax && { ageMax: currentFilters.ageMax }),
        ...(currentFilters.bloodGroup && {
          bloodGroup: currentFilters.bloodGroup,
        }),
      });

      const response = await axiosInstance.get(`/members?${queryParams}`);
      setMembers(response.members);
      setFilteredMembers(response.members);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load members. Please try again later."
      );
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    // Reset to first page when filters change
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    fetchMembers(newPage, filters);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      // Build query parameters for the export endpoint
      const queryParams = new URLSearchParams({
        ...(filters.samaj && { samaj: filters.samaj }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.maritalStatus && { maritalStatus: filters.maritalStatus }),
        ...(filters.ageMin && { ageMin: filters.ageMin }),
        ...(filters.ageMax && { ageMax: filters.ageMax }),
        ...(filters.bloodGroup && { bloodGroup: filters.bloodGroup }),
      });

      const response = await axiosInstance.get(
        `/members/download?${queryParams}`
      );

      if (response.success && response.data) {
        // Generate filename with current date
        const date = new Date().toISOString().split("T")[0];
        const filename = `members_export_${date}.csv`;

        downloadCSV(response.data, filename);
      }
    } catch (err) {
      console.error("Error downloading data:", err);
      // You might want to show an error notification here
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white shadow-lg rounded-lg border border-[#60CAE2]/20 p-8 text-center">
        <div className="text-[#6163C8] text-lg">Loading members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white shadow-lg rounded-lg border border-[#60CAE2]/20 p-8 text-center">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={() => fetchMembers(1)}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#6163C8] rounded-md hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MembersFilter onFilterChange={handleFilterChange} />
      <div className="bg-white shadow-lg rounded-lg border border-[#60CAE2]/20 overflow-hidden">
        <div className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or phone number..."
                className="w-full rounded-md border border-[#60CAE2]/20 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6163C8]"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-[#6163C8]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2 bg-[#6163C8] text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6163C8] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full bg-white shadow-lg rounded-lg border border-[#60CAE2]/20 overflow-hidden font-[Poppins]">
        <div className="px-6 py-4 bg-gradient-to-r from-[#6163C8] to-[#60CAE2]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Members List</h2>
            <span className="text-white text-sm">
              Total Members: {pagination.total}
            </span>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#60CAE2]/10 to-[#6163C8]/10">
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-[#6163C8] text-left"
                >
                  Samaj
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-[#6163C8] text-left"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-[#6163C8] text-left"
                >
                  Gender
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-[#6163C8] text-left"
                >
                  Age
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-[#6163C8] text-left"
                >
                  Blood Group
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-[#6163C8] text-left"
                >
                  Mobile 1
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-[#6163C8] text-left"
                >
                  Mobile 2
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-[#6163C8] text-right w-[140px]"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-[#6163C8]"
                  >
                    {searchTerm
                      ? "No matching members found"
                      : "No members found"}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`hover:bg-[#60CAE2]/5 transition-colors duration-150
                      ${
                        index === filteredMembers.length - 1
                          ? ""
                          : "border-b border-[#60CAE2]/20"
                      }`}
                  >
                    <td className="px-6 py-4 text-[#6163C8] text-left whitespace-nowrap">
                      {member.samajName || "-"}
                    </td>
                    <td className="px-6 py-4 text-[#6163C8] text-left whitespace-nowrap">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-[#6163C8] text-left whitespace-nowrap">
                      {member.gender}
                    </td>
                    <td className="px-6 py-4 text-[#6163C8] text-left whitespace-nowrap">
                      {member.age}
                    </td>
                    <td className="px-6 py-4 text-[#6163C8] text-left whitespace-nowrap">
                      {member.bloodGroup}
                    </td>
                    <td className="px-6 py-4 text-[#6163C8] text-left whitespace-nowrap">
                      {member.mobile1}
                    </td>
                    <td className="px-6 py-4 text-[#6163C8] text-left whitespace-nowrap">
                      {member.mobile2 || "-"}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/member/${member.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#6163C8] rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6163C8] transition-opacity"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#60CAE2]/20">
            <div className="flex justify-center gap-2">
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      pagination.currentPage === index + 1
                        ? "bg-[#6163C8] text-white"
                        : "bg-[#6163C8]/10 text-[#6163C8] hover:bg-[#6163C8]/20"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersList;
