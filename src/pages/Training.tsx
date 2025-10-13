import { Layout } from "@/components/ui/layout";
import React, { useState } from "react";

const SectionTrain = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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

  return (
    <Layout>
      <section id="train" className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto py-12 px-4 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Hybrid AgenticAI Dashboard
            </h2>
            <p className="mt-2 text-base text-gray-600 max-w-2xl leading-relaxed">
              A unified platform where AI drafts documents, paralegals review and refine them, 
              and attorneys approve—streamlining legal workflows with precision and efficiency.
            </p>
          </div>

          {/* Upload Training Documents Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Upload Training Documents</h3>
            <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                  <input
                    type="text"
                    placeholder="Enter document name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>AI Draft</option>
                      <option>Paralegal Template</option>
                      <option>SOP</option>
                      <option>Research Material</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>AI</option>
                      <option>Paralegal</option>
                      <option>Both</option>
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
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  ></textarea>
                </div>

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

            {/* Upload History */}
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
                    <tr>
                      <td className="px-3 py-2 text-sm text-gray-900">Civil Complaint Template</td>
                      <td className="px-3 py-2 text-sm text-gray-900">Ananya Sharma</td>
                      <td className="px-3 py-2 text-sm text-gray-900">2025-10-13</td>
                      <td className="px-3 py-2 text-sm text-gray-900">Both</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">In Training</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-sm text-gray-900">SOP Document Review</td>
                      <td className="px-3 py-2 text-sm text-gray-900">Rohan Gupta</td>
                      <td className="px-3 py-2 text-sm text-gray-900">2025-10-12</td>
                      <td className="px-3 py-2 text-sm text-gray-900">Paralegal</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-sm text-gray-900">Court Rule Reference</td>
                      <td className="px-3 py-2 text-sm text-gray-900">Priya Mehta</td>
                      <td className="px-3 py-2 text-sm text-gray-900">2025-10-11</td>
                      <td className="px-3 py-2 text-sm text-gray-900">AI</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pending Review</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h4 className="text-base font-semibold mb-2 text-gray-900">Feedback</h4>
              <p className="text-sm text-gray-600">AI model accuracy improved by 2% after training on new templates. Paralegal feedback: Enhanced citation guidelines noted for better compliance.</p>
            </div>
          </div>

          {/* Workflow Status Pipeline */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Workflow Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="relative p-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl font-bold text-blue-700">15</div>
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">AI Draft</div>
                <div className="text-xs text-gray-600">
                  Documents in AI generation queue
                </div>
              </div>

              <div className="relative p-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl font-bold text-blue-700">20</div>
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Paralegal Review</div>
                <div className="text-xs text-gray-600">
                  Awaiting human verification
                </div>
              </div>

              <div className="relative p-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl font-bold text-blue-700">10</div>
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Attorney Approval</div>
                <div className="text-xs text-gray-600">
                  Pending final authorization
                </div>
              </div>

              <div className="relative p-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl font-bold text-blue-700">33</div>
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Completed</div>
                <div className="text-xs text-gray-600">
                  Successfully finalized
                </div>
              </div>

            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            
            {/* Left Column */}
            <div className="space-y-8">
              
              {/* Paralegal Performance */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Performance Leaderboard
                </h3>
                <div className="space-y-3">
                  
                  <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🥇</div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">Ananya Sharma</div>
                          <div className="text-xs text-gray-600 mt-1">
                            98 pts · 12 docs · 2.5 hrs avg
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold">
                        Top Performer
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🥈</div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">Rohan Gupta</div>
                          <div className="text-xs text-gray-600 mt-1">
                            95 pts · 10 docs · 3 hrs avg
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold">
                        Consistent
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🥉</div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">Priya Mehta</div>
                          <div className="text-xs text-gray-600 mt-1">
                            92 pts · 9 docs · 3.2 hrs avg
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold">
                        Reliable
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* AgenticAI Metrics */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">AI Performance</h3>
                <div className="grid grid-cols-2 gap-3">
                  
                  <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">96%</div>
                    <div className="text-xs text-gray-600 leading-tight">
                      Draft Accuracy Rate
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
                    <div className="text-xs text-gray-600 leading-tight">
                      AI Errors Flagged
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                    <div className="text-xs text-gray-600 leading-tight">
                      Drafts Today
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
                    <div className="text-xs text-gray-600 leading-tight">
                      Training Complete
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column - Training Progress */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Training & Development
              </h3>
              <div className="space-y-4">
                
                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-semibold text-gray-900">Paralegal Training</div>
                    <div className="text-sm font-semibold text-blue-600">85%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Court rules, SOPs, Document Templates
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-semibold text-gray-900">AI Model Training</div>
                    <div className="text-sm font-semibold text-blue-600">100%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Pre-launch, Post-launch customization
                  </div>
                </div>

                {/* Recent Training Activities */}
                <div className="mt-6">
                  <h4 className="text-base font-semibold mb-3 text-gray-900">Recent Activity</h4>
                  <div className="space-y-2">
                    
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">New template uploaded</div>
                        <div className="text-xs text-gray-600 mt-0.5">Civil complaint - District Court · 2 hours ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">AI training completed</div>
                        <div className="text-xs text-gray-600 mt-0.5">Updated jurisdiction rules · 5 hours ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">SOP updated</div>
                        <div className="text-xs text-gray-600 mt-0.5">Document review checklist v2.1 · 1 day ago</div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Operational KPIs */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Key Performance Indicators</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm text-center hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">99.2%</div>
                <div className="text-xs text-gray-600">
                  Overall Accuracy
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm text-center hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">3.2 hrs</div>
                <div className="text-xs text-gray-600">
                  Avg Turnaround
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm text-center hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">33 / 45</div>
                <div className="text-xs text-gray-600">
                  Completion Rate
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm text-center hover:shadow-md transition-shadow duration-200">
                <div className="text-sm font-semibold text-blue-600 mb-1">
                  Paralegal Review
                </div>
                <div className="text-xs text-gray-600">
                  Current Bottleneck
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export { SectionTrain };
