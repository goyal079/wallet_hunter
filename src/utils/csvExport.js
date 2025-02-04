import { json2csv } from "json-2-csv";

export const downloadCSV = (data, filename = "members_data.csv") => {
  const csv = json2csv(data);

  // Create a Blob containing the CSV data
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Create a download link
  const link = document.createElement("a");

  // Create the download URL
  if (window.navigator.msSaveBlob) {
    // For IE
    window.navigator.msSaveBlob(blob, filename);
  } else {
    // For other browsers
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
