import { Layout } from "@/components/ui/layout";
import React from "react";

const SectionTrain = () => {
  return (
    <Layout>
      <section id="train" className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto py-16 px-6 lg:px-12">
          
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Hybrid AgenticAI Dashboard
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl leading-relaxed">
              A unified platform where AI drafts documents, paralegals review and refine them, 
              and attorneys approve—streamlining legal workflows with precision and efficiency.
            </p>
          </div>

          {/* Workflow Status Pipeline */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Workflow Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="relative p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl font-bold text-blue-700">15</div>
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="text-base font-semibold text-gray-900 mb-1">AI Draft</div>
                <div className="text-sm text-gray-600">
                  Documents in AI generation queue
                </div>
              </div>

              <div className="relative p-6 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl font-bold text-orange-700">20</div>
                  <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-base font-semibold text-gray-900 mb-1">Paralegal Review</div>
                <div className="text-sm text-gray-600">
                  Awaiting human verification
                </div>
              </div>

              <div className="relative p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl font-bold text-green-700">10</div>
                  <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-base font-semibold text-gray-900 mb-1">Attorney Approval</div>
                <div className="text-sm text-gray-600">
                  Pending final authorization
                </div>
              </div>

              <div className="relative p-6 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl font-bold text-emerald-700">33</div>
                  <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-base font-semibold text-gray-900 mb-1">Completed</div>
                <div className="text-sm text-gray-600">
                  Successfully finalized
                </div>
              </div>

            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid lg:grid-cols-2 gap-10 mb-12">
            
            {/* Left Column */}
            <div className="space-y-10">
              
              {/* Paralegal Performance */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  Performance Leaderboard
                </h3>
                <div className="space-y-4">
                  
                  <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">🥇</div>
                        <div>
                          <div className="font-semibold text-base text-gray-900">Ananya Sharma</div>
                          <div className="text-sm text-gray-600 mt-1">
                            98 pts · 12 docs · 2.5 hrs avg
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-800 text-xs font-semibold">
                        Top Performer
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">🥈</div>
                        <div>
                          <div className="font-semibold text-base text-gray-900">Rohan Gupta</div>
                          <div className="text-sm text-gray-600 mt-1">
                            95 pts · 10 docs · 3 hrs avg
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                        Consistent
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">🥉</div>
                        <div>
                          <div className="font-semibold text-base text-gray-900">Priya Mehta</div>
                          <div className="text-sm text-gray-600 mt-1">
                            92 pts · 9 docs · 3.2 hrs avg
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                        Reliable
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* AgenticAI Metrics */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">AI Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">96%</div>
                    <div className="text-sm text-gray-600 leading-snug">
                      Draft Accuracy Rate
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="text-3xl font-bold text-red-600 mb-2">5</div>
                    <div className="text-sm text-gray-600 leading-snug">
                      AI Errors Flagged
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                    <div className="text-sm text-gray-600 leading-snug">
                      Drafts Today
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600 leading-snug">
                      Training Complete
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column - Training Progress */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                Training & Development
              </h3>
              <div className="space-y-6">
                
                <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-base font-semibold text-gray-900">Paralegal Training</div>
                    <div className="text-sm font-semibold text-blue-600">85%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Court rules, SOPs, Document Templates
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-base font-semibold text-gray-900">AI Model Training</div>
                    <div className="text-sm font-semibold text-green-600">100%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Pre-launch, Post-launch customization
                  </div>
                </div>

                {/* Recent Training Activities */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">Recent Activity</h4>
                  <div className="space-y-3">
                    
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">New template uploaded</div>
                        <div className="text-xs text-gray-600 mt-1">Civil complaint - District Court · 2 hours ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">AI training completed</div>
                        <div className="text-xs text-gray-600 mt-1">Updated jurisdiction rules · 5 hours ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">SOP updated</div>
                        <div className="text-xs text-gray-600 mt-1">Document review checklist v2.1 · 1 day ago</div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Operational KPIs */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Key Performance Indicators</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm text-center hover:shadow-md transition-shadow duration-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.2%</div>
                <div className="text-sm text-gray-600">
                  Overall Accuracy
                </div>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm text-center hover:shadow-md transition-shadow duration-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">3.2 hrs</div>
                <div className="text-sm text-gray-600">
                  Avg Turnaround
                </div>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm text-center hover:shadow-md transition-shadow duration-200">
                <div className="text-3xl font-bold text-green-600 mb-2">33 / 45</div>
                <div className="text-sm text-gray-600">
                  Completion Rate
                </div>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm text-center hover:shadow-md transition-shadow duration-200">
                <div className="text-base font-semibold text-orange-600 mb-2">
                  Paralegal Review
                </div>
                <div className="text-sm text-gray-600">
                  Current Bottleneck
                </div>
              </div>

            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-8">
            <button className="group px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5">
              <span className="flex items-center gap-2">
                Upload Training Documents
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </span>
            </button>
            <p className="mt-4 text-sm text-gray-600 max-w-2xl mx-auto">
              Add templates, SOPs, court rules, and research materials to continuously improve AI accuracy and paralegal efficiency
            </p>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export { SectionTrain };
