// pages/SingleTaskPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api/config';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
  Paperclip, // New
  File,      // New
  Download,  // New
  Tag,       // New
  StickyNote // New
} from 'lucide-react';
import { Layout } from '@/components/ui/layout';
import { toast } from 'sonner'; // Ensure you have this installed

const SingleTaskPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for file handling
  const [openingFileIndex, setOpeningFileIndex] = useState(null);

  // Fetch task details and time entries
  useEffect(() => {
    fetchTaskData();
  }, [taskId]);

  const fetchTaskData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskRes, logsRes] = await Promise.all([
        apiClient.get(`/api/tasks/${taskId}`),
        apiClient.get(`/api/time-entries?taskId=${taskId}`)
      ]);
      
      if (taskRes.data.success) {
        setTask(taskRes.data.data);
      } else {
        throw new Error(taskRes.data.message || 'Failed to load task');
      }

      if (logsRes.data.success) {
        const entries = logsRes.data.data || [];
        setLogs(entries);
        const totalSeconds = entries.reduce((acc, log) => acc + (log.duration || 0), 0);
        setTotalHours(totalSeconds / 3600);
      } else {
        setLogs([]);
        setTotalHours(0);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load task data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Secure File Access Handler
  const handleFileClick = async (e, fileUrl, index) => {
    e.preventDefault(); 
    if (openingFileIndex !== null) return; // Prevent double clicks

    setOpeningFileIndex(index);

    try {
      // 1. Extract Key from URL
      let key = "";
      try {
        const urlObj = new URL(fileUrl);
        key = urlObj.pathname.substring(1); 
      } catch (err) {
        toast.error("Invalid file URL format");
        setOpeningFileIndex(null);
        return;
      }

      // 2. Request Signed URL
      const response = await apiClient.get(`/api/tasks/download-url?key=${encodeURIComponent(key)}`);
      
      if (response.data.success && response.data.url) {
        window.open(response.data.url, '_blank');
      } else {
        toast.error("Failed to generate secure link");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error accessing file.");
    } finally {
      setOpeningFileIndex(null);
    }
  };

  // Status color classes helper
  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800 border-green-300',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
      'In Review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'To do': 'bg-orange-100 text-orange-800 border-orange-300',
      'Pending Assignment': 'bg-gray-100 text-gray-800 border-gray-300',
      'Not Started': 'bg-purple-100 text-purple-800 border-purple-300',
      'Blocked': 'bg-red-100 text-red-800 border-red-300',
      'Cancelled': 'bg-slate-100 text-slate-800 border-slate-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Research': 'bg-blue-100 text-blue-800 border-blue-300',
      'Drafting': 'bg-green-100 text-green-800 border-green-300',
      'Review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Filing': 'bg-purple-100 text-purple-800 border-purple-300',
      'Meeting': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Communication': 'bg-teal-100 text-teal-800 border-teal-300',
      'Administrative': 'bg-orange-100 text-orange-800 border-orange-300',
      'Other': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getAssignedByName = () => {
    return task.assignedBy?.fullName || task.assignedBy?.firstName || 'Attorney';
  };

  const getAssignedToName = () => {
    return task.assignedTo?.fullName ||
           (task.assignedTo?.firstName && task.assignedTo?.lastName ?
            `${task.assignedTo.firstName} ${task.assignedTo.lastName}` :
            'Paralegal');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-lg">Loading task details...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error}</h1>
          <button
            onClick={fetchTaskData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center mx-auto space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // No task found
  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Task not found</h1>
          <p className="text-gray-600 mb-4">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getChecklistProgress = () => {
    if (!task.checklistItems || task.checklistItems.length === 0) return { completed: 0, total: 0 };
    const total = task.checklistItems.length;
    const completed = task.checklistItems.filter(item => item.completed).length;
    return { completed, total };
  };

  const checklistProgress = getChecklistProgress();
  const checklistProgressPercent = checklistProgress.total > 0 ? 
    (checklistProgress.completed / checklistProgress.total) * 100 : 0;

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <p className="text-sm text-gray-500">Task ID: {task._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            {task.createdAt && (
              <span title="Created Date">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </span>
            )}
            {task.assignedAt && (
              <span title="Assigned Date">
                Assigned: {new Date(task.assignedAt).toLocaleDateString()}
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 rounded-full font-medium text-xs text-gray-500 border border-gray-200">
              View Only
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-80px)]">
        {/* Left Panel: Task Details (View Only) */}
        <aside className="w-1/2 border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <FileText size={20} className="mr-2 text-blue-600" />
                Task Details
              </h2>
              
              {/* Task Info Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Type */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Type
                      </label>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${
                        getTypeColor(task.type).replace('text-', 'border-')
                      }`}>
                        {task.type}
                      </span>
                    </div>
                  </div>

                  {/* Priority & Status */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Priority
                      </label>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                        task.priority === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
                        task.priority === 'High' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Status
                      </label>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  {/* Dates & Hours */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Due Date
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Estimated Hours
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {task.estimatedHours || 0}h
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Progress Summary */}
                  {task.checklistItems && task.checklistItems.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Checklist Progress
                          </label>
                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${checklistProgressPercent}%` }}
                              ></div>
                            </div>
                            <p className="text-sm font-semibold text-blue-600">
                              {checklistProgress.completed}/{checklistProgress.total} items completed
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actual Hours */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Total Logged Hours
                        </label>
                        <p className="text-lg font-semibold text-blue-600">
                          {totalHours.toFixed(2)}h
                        </p>
                        <p className="text-sm text-gray-500">
                          {logs.length} entry{logs.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-medium text-gray-500 mb-3">
                    Description
                  </label>
                  <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {task.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Notes (Added) */}
                {task.notes && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <label className="block text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <StickyNote size={16} className="mr-2" />
                      Internal Notes
                    </label>
                    <div className="prose prose-sm max-w-none bg-yellow-50 p-4 rounded-md border border-yellow-100">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {task.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Assignment Info */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                    <User size={16} className="mr-2" />
                    Assignment
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {task.assignedBy && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Assigned By</p>
                          <p className="text-gray-600">
                            {getAssignedByName()}
                          </p>
                        </div>
                      </div>
                    )}
                    {task.assignedTo && (
                      <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Assigned To</p>
                          <p className="text-gray-600">
                            {getAssignedToName()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Case Info (if populated) */}
                {task.case && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                      <FileText size={16} className="mr-2" />
                      Related Case
                    </h4>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {task.case.name || task.case.title || 'Unnamed Case'}
                      </p>
                      {task.case.caseNumber && (
                        <p className="text-sm text-gray-600">
                          Case #: {task.case.caseNumber}
                        </p>
                      )}
                      {task.case.serviceType && (
                        <p className="text-sm text-gray-600">
                          Service: {task.case.serviceType}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents / Attachments Section (Added) */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                      <Paperclip size={16} className="mr-2" />
                      Documents & Attachments
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {task.attachments.map((att, index) => (
                        <a
                          key={index}
                          href="#"
                          onClick={(e) => handleFileClick(e, att.url, index)}
                          className={`flex items-center p-2.5 border rounded-lg transition-colors group bg-white cursor-pointer hover:bg-gray-50 ${
                            openingFileIndex === index ? 'bg-gray-50 border-blue-200' : 'border-gray-200'
                          }`}
                        >
                          <div className="p-2 bg-blue-50 rounded-md mr-3 group-hover:bg-blue-100 transition-colors">
                            <File size={16} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate" title={att.name}>
                              {att.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {att.size ? `${(att.size / 1024 / 1024).toFixed(2)} MB` : 'Document'}
                              {att.uploadedAt && ` • ${new Date(att.uploadedAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="ml-2 text-gray-400 group-hover:text-blue-600">
                            {openingFileIndex === index ? (
                              <Loader2 size={16} className="animate-spin text-blue-600" />
                            ) : (
                              <Download size={16} />
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags Section (Added) */}
                {task.tags && task.tags.length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                      <Tag size={16} className="mr-2" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklist Section (Read Only) */}
                {task.checklistItems && task.checklistItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <CheckCircle size={16} className="mr-2" />
                        Checklist ({checklistProgress.completed}/{checklistProgress.total})
                      </h4>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {task.checklistItems.map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                            item.completed 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className={`flex-shrink-0 p-1 rounded-full ${
                             item.completed 
                               ? 'text-green-600' 
                               : 'text-gray-400'
                           }`}>
                            {item.completed ? (
                              <CheckSquare size={20} />
                            ) : (
                              <Square size={20} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${item.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                              {item.text}
                            </p>
                            {item.completedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                Completed: {new Date(item.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Panel: Working Logs (View Only) */}
        <main className="w-1/2 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-md font-semibold text-gray-900 flex items-center">
                  <Clock size={20} className="mr-2 text-blue-600" />
                  Time Entries
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {logs.length}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Recorded work sessions for this task
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  <Clock size={16} className="mr-2" />
                  {totalHours.toFixed(2)}h total
                </div>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-4">
              {logs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No time entries yet
                  </h3>
                  <p className="text-gray-500">
                    No work has been logged for this task yet.
                  </p>
                </div>
              ) : (
                logs.map((log) => (
                  <article
                    key={log._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          {/* Log Info Header */}
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                            {/* Date */}
                            <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                              <Calendar size={14} className="mr-1" />
                              {new Date(log.startTime || log.createdAt).toLocaleDateString()}
                            </span>
                            
                            {/* Time */}
                            <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                              <Clock size={14} className="mr-1" />
                              {new Date(log.startTime || log.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>

                            {/* User */}
                            <span className="flex items-center font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                              <User size={14} className="mr-1" />
                              {log.user?.fullName || log.user?.firstName || 'Unknown User'}
                            </span>

                            {/* Billable Status */}
                            {log.isBillable && (
                                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                                    Billable
                                </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                             <div className="text-sm text-gray-500 italic">
                                {log.isRunning ? (
                                    <span className="text-green-600 font-semibold flex items-center">
                                        <Loader2 size={12} className="animate-spin mr-1"/> Timer Running
                                    </span>
                                ) : "Duration"}
                             </div>
                             <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-bold border border-gray-200">
                                <Clock size={14} className="mr-1" />
                                {((log.duration || 0) / 3600).toFixed(2)}h
                              </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-50">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                          {log.description || "No description provided."}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={fetchTaskData}
                disabled={loading}
                className="flex items-center justify-center mx-auto px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <span className="mr-2">
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </span>
                <ArrowLeft size={16} className={`transform ${loading ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
    </Layout>
  );
};

export default SingleTaskPage;