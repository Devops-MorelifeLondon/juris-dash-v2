import { Layout } from "@/components/ui/layout";
import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/config";
import { Mic, MicOff } from "lucide-react";

const SectionTrain = () => {
  // --- STATE ---
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Paralegal Template");
  const [assignedTo, setAssignedTo] = useState("Both");
  const [priority, setPriority] = useState("Low");
  const [description, setDescription] = useState("");
  const [uploadHistory, setUploadHistory] = useState([]);
  const [paralegals, setParalegals] = useState([]);
  const [selectedParalegals, setSelectedParalegals] = useState([]);

  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<"documentName" | "description" | null>(null);

  // ✅ Speech recognition logic
  const startListening = (field: "documentName" | "description") => {
    if (!("webkitSpeechRecognition" in window)) {
      setMessage({ type: "error", text: "Speech recognition not supported in this browser." });
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    setIsListening(true);
    setActiveField(field);
    recognition.start();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      if (field === "documentName") {
        setDocumentName(prev => prev + " " + transcript);
      } else if (field === "description") {
        setDescription(prev => prev + " " + transcript);
      }
    };

    recognition.onerror = () => {
      setMessage({ type: "error", text: "Speech recognition error. Try again." });
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveField(null);
    };
  };

  const stopListening = () => {
    setIsListening(false);
    setActiveField(null);
  };

  // ---------------- FETCH HISTORY ----------------
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

  useEffect(() => {
    fetchHistory();
  }, []);

  // ---------------- GET DOWNLOAD URL ----------------
  const getSignedUrl = async (key) => {
    const res = await apiClient.get(
      `/api/training/file-url?key=${encodeURIComponent(key)}`
    );
    return res.data.url;
  };

  const handlePreview = async (key) => {
    try {
      const url = await getSignedUrl(key);
      window.open(url, "_blank");
    } catch {
      setMessage({ type: "error", text: "Preview failed" });
    }
  };

  const handleDownload = async (key, fileName) => {
    try {
      const url = await getSignedUrl(key);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    } catch {
      setMessage({ type: "error", text: "Download failed" });
    }
  };

  // ---------------- UPLOAD HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!file) {
      return setMessage({ type: "error", text: "Please select a file." });
    }

    try {
      // 1️⃣ Generate presigned upload URL
      const presignRes = await apiClient.post("/api/training/generate-upload-url", {
        fileName: file.name,
        fileType: file.type,
      });

      const { uploadUrl, key } = presignRes.data;

      // 2️⃣ Upload file directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("S3 Upload failed");
      }

      // 3️⃣ Save metadata
      await apiClient.post("/api/training/save-metadata", {
        documentName,
        documentType,
        assignedTo,
        priority,
        description,
        filePath: key,
        originalFileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        paralegalAssignedTo: selectedParalegals 
      });

      setMessage({ type: "success", text: "Document uploaded successfully!" });

      setFile(null);
      setDocumentName("");
      setDescription("");
      setSelectedParalegals([]);
      fetchHistory();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Upload failed.",
      });
    }
  };

  // ---------------- DRAG N DROP ----------------
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  // ---------------- STATUS COLORS ----------------
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Training":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  useEffect(() => {
    if (assignedTo === "Paralegal" || assignedTo === "Both") {
      loadParalegals();
    }
  }, [assignedTo]);

  const loadParalegals = async () => {
    try {
      const res = await apiClient.get("/api/paralegals/linked");
      if (res.data.success) {
        setParalegals(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load paralegals", err);
    }
  };

  // ---------------- UI ----------------
  return (
    <Layout>
      <section id="train" className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto py-12 px-4 lg:px-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Upload Training Documents
            </h3>

            {/* FORM */}
            <div className="p-4 rounded-xl border bg-white shadow-sm">
              <form className="space-y-4" onSubmit={handleSubmit}>

                {/* DOCUMENT NAME with mic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Name
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Enter document name"
                      className="w-full p-2 border rounded-md"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className={`p-2 border rounded-md ${
                        activeField === "documentName" && isListening
                          ? "bg-red-600 border-red-300"
                          : "bg-gray-50 border-gray-300"
                      }`}
                      onClick={() =>
                        isListening && activeField === "documentName"
                          ? stopListening()
                          : startListening("documentName")
                      }
                    >
                      {isListening && activeField === "documentName" ? (
                        <MicOff className="h-4 w-4 text-white bg-red-600" />
                      ) : (
                        <Mic className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SELECTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      <option>Paralegal Template</option>
                      <option>AI Draft</option>
                      <option>SOP</option>
                      <option>Research Material</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option>Both</option>
                      <option>AI</option>
                      <option>Paralegal</option>
                    </select>
                  </div>
                </div>

                {(assignedTo === "Paralegal" || assignedTo === "Both") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign To Paralegal(s)
                    </label>

                    <select
                      multiple
                      className="w-full p-2 border rounded-md h-32"
                      value={selectedParalegals}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                        setSelectedParalegals(selected);
                      }}
                    >
                      {paralegals.length === 0 && (
                        <option disabled>No paralegals linked to you</option>
                      )}

                      {paralegals.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.firstName} {p.lastName}
                        </option>
                      ))}
                    </select>

                    <p className="text-xs text-gray-500 mt-1">
                      Hold CTRL (Windows) or CMD (Mac) to select multiple.
                    </p>
                  </div>
                )}

                {/* FILE UPLOAD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>

                  <div
                    className={`relative w-full p-4 border-2 border-dashed rounded-md text-center transition ${
                      dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".docx,application/pdf,text/plain"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : "Drag & drop or click to browse"}
                    </p>
                  </div>
                </div>

                {/* PRIORITY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                {/* DESCRIPTION with mic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="flex gap-2 items-start">
                    <textarea
                      rows={3}
                      className="w-full p-2 border rounded-md"
                      placeholder="Add instructions/notes..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <button
                      type="button"
                      className={`p-2 border rounded-md mt-1 ${
                        activeField === "description" && isListening
                          ? "bg-red-600 border-red-300"
                          : "bg-gray-50 border-gray-300"
                      }`}
                      onClick={() =>
                        isListening && activeField === "description"
                          ? stopListening()
                          : startListening("description")
                      }
                    >
                      {isListening && activeField === "description" ? (
                         <MicOff className="h-4 w-4 text-white bg-red-600" />
                      ) : (
                        <Mic className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* MESSAGE */}
                {message && (
                  <div
                    className={`p-3 rounded-md text-sm ${
                      message.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setFile(null);
                      setDocumentName("");
                      setDescription("");
                      setSelectedParalegals([]);
                      setMessage(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Upload & Train
                  </button>
                </div>
              </form>
            </div>

            {/* HISTORY TABLE */}
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-3 text-gray-900">
                Upload History
              </h4>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">
                        Document Name
                      </th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">
                        Uploaded By
                      </th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">
                        Assigned To
                      </th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">
                        Preview
                      </th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500 uppercase">
                        Download
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadHistory.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-3 py-2 text-sm text-gray-500 text-center"
                        >
                          No documents uploaded yet.
                        </td>
                      </tr>
                    )}

                    {uploadHistory.map((doc) => (
                      <tr key={doc._id}>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {doc.documentName}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {doc.uploadedBy}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {doc.createdAt}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {doc.assignedTo}
                        </td>

                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              doc.status
                            )}`}
                          >
                            {doc.status}
                          </span>
                        </td>

                        <td className="px-3 py-2">
                          <button
                            onClick={() => handlePreview(doc.filePath)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Preview
                          </button>
                        </td>

                        <td className="px-3 py-2">
                          <button
                            onClick={() =>
                              handleDownload(doc.filePath, doc.originalFileName)
                            }
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export { SectionTrain };