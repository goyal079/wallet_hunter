import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../config/axios";

function MemberDetails() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const data = await axiosInstance.get(`/members/${id}`);
      setMember(data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load member details. Please try again later."
      );
      console.error("Error fetching member details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white shadow-lg rounded-lg border border-[#60CAE2]/20 p-8 text-center">
        <div className="text-[#6163C8] text-lg">Loading member details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white shadow-lg rounded-lg border border-[#60CAE2]/20 p-8 text-center">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={fetchMemberDetails}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#6163C8] rounded-md hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!member) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const details = [
    {
      section: "Personal Information",
      fields: [
        { label: "Full Name", value: member.name },
        { label: "Gender", value: member.gender },
        { label: "Age", value: member.age },
        { label: "Date of Birth", value: formatDate(member.dateOfBirth) },
        { label: "Blood Group", value: member.bloodGroup },
        { label: "Marital Status", value: member.maritalStatus || "-" },
        { label: "Date of Marriage", value: formatDate(member.dateOfMarriage) },
        { label: "Mother Tongue", value: member.motherTongue },
        { label: "Dietary Preference", value: member.dietaryPreference },
      ],
    },
    {
      section: "Family Information",
      fields: [
        { label: "Family Name", value: member.family?.name },
        { label: "Father Name", value: member.fatherName || "-" },
        { label: "Mother Name", value: member.motherName || "-" },
        { label: "Gotra", value: member.gotra },
        { label: "Native Place", value: member.nativePlace },
        { label: "Samaj", value: member.samaj?.name || "-" },
      ],
    },
    {
      section: "Contact Information",
      fields: [
        { label: "Mobile 1", value: member.mobile1 },
        { label: "Mobile 2", value: member.mobile2 || "-" },
        { label: "Email", value: member.email || "-" },
        {
          label: "Current Address",
          value: member.currentResidentialAddress || "-",
        },
        {
          label: "Emergency Contact",
          value: member.emergencyContactName || "-",
        },
        {
          label: "Emergency Number",
          value: member.emergencyContactNumber || "-",
        },
      ],
    },
    {
      section: "Professional Information",
      fields: [
        { label: "Education", value: member.education },
        { label: "Occupation", value: member.occupation || "-" },
        { label: "Annual Income", value: formatCurrency(member.annualIncome) },
        { label: "Business Details", value: member.businessDetails || "-" },
      ],
    },
    {
      section: "Documents & Health",
      fields: [
        { label: "Aadhar Number", value: member.aadharNumber || "-" },
        { label: "PAN Number", value: member.panNumber || "-" },
        {
          label: "Health Insurance",
          value: member.healthInsuranceDetails || "-",
        },
        {
          label: "Health Conditions",
          value: member.chronicHealthConditions || "-",
        },
      ],
    },
    {
      section: "Additional Information",
      fields: [
        { label: "Special Skills", value: member.specialSkills || "-" },
        { label: "Member Since", value: formatDate(member.createdAt) },
        { label: "Last Updated", value: formatDate(member.updatedAt) },
      ],
    },
  ];

  return (
    <div className="w-full bg-white shadow-lg rounded-lg border border-[#60CAE2]/20 overflow-hidden font-[Poppins]">
      <div className="px-6 py-4 bg-gradient-to-r from-[#6163C8] to-[#60CAE2]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">Member Details</h2>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#6163C8] bg-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6163C8] transition-opacity"
          >
            ← Back to List
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#6163C8]/5 to-[#60CAE2]/5 p-8 border-b border-[#60CAE2]/20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[#6163C8] mb-4">
            {member.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#60CAE2]/20">
              <div className="text-sm text-slate-500 mb-1">Family</div>
              <div className="text-xl font-semibold text-[#6163C8]">
                {member.family?.name || "-"}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#60CAE2]/20">
              <div className="text-sm text-slate-500 mb-1">Samaj</div>
              <div className="text-xl font-semibold text-[#6163C8]">
                {member.samaj?.name || "-"}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#60CAE2]/20">
              <div className="text-sm text-slate-500 mb-1">Blood Group</div>
              <div className="text-xl font-semibold text-[#6163C8]">
                {member.bloodGroup}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#60CAE2]/20">
              <div className="text-sm text-slate-500 mb-1">Contact</div>
              <div className="text-lg font-semibold text-[#6163C8]">
                {member.mobile1}
                {member.mobile2 && (
                  <span className="text-sm text-slate-400 ml-2">
                    ({member.mobile2})
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-[#60CAE2]/20">
              <div className="text-sm text-slate-500 mb-1">
                Age & Birth Date
              </div>
              <div className="text-lg font-semibold text-[#6163C8]">
                {member.age} years
                <span className="text-sm text-slate-400 ml-2">
                  ({formatDate(member.dateOfBirth)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((section) => (
          <div
            key={section.section}
            className="bg-white rounded-lg border border-[#60CAE2]/20"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-[#60CAE2]/10 to-[#6163C8]/10">
              <h3 className="text-lg font-semibold text-[#6163C8]">
                {section.section}
              </h3>
            </div>
            <div className="p-4">
              <dl className="grid grid-cols-1 gap-3">
                {section.fields.map((field) => (
                  <div key={field.label} className="flex flex-col">
                    <dt className="text-sm font-medium text-slate-500">
                      {field.label}
                    </dt>
                    <dd className="text-sm text-[#6163C8]">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberDetails;
