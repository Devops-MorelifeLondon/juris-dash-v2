import { Layout } from "@/components/ui/layout";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { apiClient } from "@/lib/api/config";

const SectionTrain = () => {
  // --- STATE FOR ALL FORM FIELDS ---
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Paralegal Template");
  const [assignedTo, setAssignedTo] = useState("Both");
  const [priority, setPriority] = useState("Low");
  const [description, setDescription] = useState("");
  const [uploadHistory, setUploadHistory] = useState([]); // For the table
  
  // --- STATE FOR UI ---
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState(null); // For success/error messages

  // --- FETCH UPLOAD HISTORY ---
// inside SectionTrain component

const fetchHistory = async () => {
  try {

    const res = await apiClient.get("/api/training/history");

    if (res.data.success) {
      const formatted = res.data.data.map((doc) => ({
        ...doc,
        createdAt: new Date(doc.createdAt).toLocaleString(),
      }));
      setUploadHistory(formatted);
    }
  } catch (err) {
    console.error("Error fetching history", err);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(null);

  if (!file) return setMessage({ type: 'error', text: 'Please select a file.' });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentName', documentName);
  formData.append('documentType', documentType);
  formData.append('assignedTo', assignedTo);
  formData.append('priority', priority);
  formData.append('description', description);

  try {
    
    const res = await apiClient.post("/api/training/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });

    setMessage({ type: 'success', text: res.data.message });
    setFile(null);
    setDocumentName("");
    setDescription("");
    fetchHistory();
  } catch (err) {
    setMessage({ type: 'error', text: err.response?.data?.message || "Upload failed." });
  }
};

  
  // Fetch history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // --- DRAG & DROP HANDLERS ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };


  // Helper for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Training':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Review':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <section id="train" className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto py-12 px-4 lg:px-8">
          
          {/* ... Your Header ... */}
          <div className="mb-8">...</div>

          {/* Upload Training Documents Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Upload Training Documents</h3>
            <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              
              {/* ATTACH SUBMIT HANDLER TO FORM */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                  <input
                    type="text"
                    placeholder="Enter document name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      {/* Your options from the mockup didn't match the model, I used the model's */}
                      <option>Paralegal Template</option>
                      <option>AI Draft</option>
                      <option>SOP</option>
                      <option>Research Material</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option>Both</option>
                      <option>AI</option>
                      <option>Paralegal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                  <div
                    className={`relative w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center transition-colors ${
                      dragActive ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".docx,application/pdf,text/plain"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : "Drag & drop or click to browse DOCX, PDF, TXT"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority / Relevance (Optional)</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                  <textarea
                    placeholder="Add instructions or notes..."
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                
                {/* Message Area */}
                {message && (
                  <div className={`p-3 rounded-md text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {message.text}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Upload & Train
                  </button>
                </div>
              </form>
            </div>

            {/* Upload History Table (Now Dynamic) */}
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3 text-gray-900">Upload History</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadHistory.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-3 py-2 text-sm text-gray-500 text-center">No documents uploaded yet.</td>
                      </tr>
                    )}
                    {uploadHistory.map((doc) => (
                      <tr key={doc._id}>
                        <td className="px-3 py-2 text-sm text-gray-900">{doc.documentName}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{doc.uploadedBy}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{doc.createdAt}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{doc.assignedTo}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ... Your Feedback Section ... */}
            <div className="mt-4 p-4 bg-blue-50 rounded-md">...</div>
          </div>

          {/* ... Your Workflow, Performance, and KPI sections ... */}
          
        </div>
      </section>
    </Layout>
  );
};

export { SectionTrain };