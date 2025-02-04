import { useState, useEffect } from "react";
import axiosInstance from "../config/axios";

function MembersFilter({ onFilterChange }) {
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    samaj: "",
    gender: "",
    maritalStatus: "",
    ageMin: "",
    ageMax: "",
    bloodGroup: "",
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const data = await axiosInstance.get("/members/filter-options");
      setFilterOptions(data);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };

    setFilters(newFilters);

    const cleanFilters = {};
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        cleanFilters[key] = val;
      }
    });

    onFilterChange(cleanFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      samaj: "",
      gender: "",
      maritalStatus: "",
      ageMin: "",
      ageMax: "",
      bloodGroup: "",
    };
    setFilters(emptyFilters);
    onFilterChange({});
  };

  if (loading || !filterOptions) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg border border-[#60CAE2]/20 overflow-hidden mb-6">
      <div className="px-6 py-4 bg-gradient-to-r from-[#6163C8] to-[#60CAE2]">
        <h2 className="text-lg font-semibold text-white">Filter Members</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#6163C8] mb-2">
            Samaj
          </label>
          <select
            value={filters.samaj}
            onChange={(e) => handleFilterChange("samaj", e.target.value)}
            className="w-full rounded-md border border-[#60CAE2]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6163C8]"
          >
            <option value="">All Samaj</option>
            {filterOptions.samajOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6163C8] mb-2">
            Blood Group
          </label>
          <select
            value={filters.bloodGroup}
            onChange={(e) => handleFilterChange("bloodGroup", e.target.value)}
            className="w-full rounded-md border border-[#60CAE2]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6163C8]"
          >
            <option value="">All Blood Groups</option>
            {filterOptions.bloodGroupOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6163C8] mb-2">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
            className="w-full rounded-md border border-[#60CAE2]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6163C8]"
          >
            <option value="">All Genders</option>
            {filterOptions.genderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6163C8] mb-2">
            Age Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={filterOptions.ageRange.min}
              max={filterOptions.ageRange.max}
              value={filters.ageMin}
              onChange={(e) => handleFilterChange("ageMin", e.target.value)}
              placeholder="Min"
              className="w-full rounded-md border border-[#60CAE2]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6163C8]"
            />
            <input
              type="number"
              min={filterOptions.ageRange.min}
              max={filterOptions.ageRange.max}
              value={filters.ageMax}
              onChange={(e) => handleFilterChange("ageMax", e.target.value)}
              placeholder="Max"
              className="w-full rounded-md border border-[#60CAE2]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6163C8]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6163C8] mb-2">
            Marital Status
          </label>
          <select
            value={filters.maritalStatus}
            onChange={(e) =>
              handleFilterChange("maritalStatus", e.target.value)
            }
            className="w-full rounded-md border border-[#60CAE2]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6163C8]"
          >
            <option value="">All Statuses</option>
            {filterOptions.maritalStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-[#6163C8] bg-[#6163C8]/10 rounded-md hover:bg-[#6163C8]/20 focus:outline-none focus:ring-2 focus:ring-[#6163C8] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default MembersFilter;
