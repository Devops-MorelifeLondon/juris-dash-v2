// pages/SingleTaskPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api/config';
import Cookies from 'js-cookie';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Loader2,
  CheckSquare,
  Square
} from 'lucide-react';
import { Layout } from '@/components/ui/layout';

const SingleTaskPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [updatingChecklist, setUpdatingChecklist] = useState(false);

  // Log management states
  const [showAddLogForm, setShowAddLogForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [logFormData, setLogFormData] = useState({
    title: '',
    description: '',
    type: 'Research',
    hoursSpent: 0,
    status: 'Draft'
  });

  // Fetch task details and logs
  useEffect(() => {
    fetchTaskData();
  }, [taskId]);

  const fetchTaskData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskRes, logsRes] = await Promise.all([
        apiClient.get(`/api/tasks/${taskId}`),
        apiClient.get(`/api/tasklogs/${taskId}/logs`)
      ]);
      console.log("Task : ",taskRes);
      console.log("Logs : ",logsRes);
      
      if (taskRes.data.success) {
        setTask(taskRes.data.data);
      } else {
        throw new Error(taskRes.data.message || 'Failed to load task');
      }

      if (logsRes.data.success) {
        setLogs(logsRes.data.data || []);
        setTotalHours(logsRes.data.totalHours || 0);
      } else {
        setLogs([]);
        setTotalHours(0);
      }
    } catch (err) {
      console.error('Error fetching task data:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load task data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Checklist handlers
  const handleChecklistToggle = async (index) => {
    if (!task.checklistItems) return;
    
    const updatedItems = [...task.checklistItems];
    const item = updatedItems[index];
    
    // Toggle completion status
    item.completed = !item.completed;
    if (item.completed && !item.completedAt) {
      item.completedAt = new Date();
    } else if (!item.completed) {
      item.completedAt = null;
    }

    setUpdatingChecklist(true);
    try {
      // Update only checklistItems in the task
      const response = await apiClient.patch(`/api/tasks/${taskId}/checklist`, {
        checklistItems: updatedItems
      });
      
      if (response.data.success) {
        setTask(prev => ({ ...prev, checklistItems: updatedItems }));
      } else {
        throw new Error(response.data.message || 'Failed to update checklist');
      }
    } catch (err) {
      console.error('Error updating checklist:', err);
      // Revert optimistic update
      const originalItems = [...task.checklistItems];
      originalItems[index].completed = !item.completed;
      if (originalItems[index].completed) {
        originalItems[index].completedAt = new Date();
      } else {
        originalItems[index].completedAt = null;
      }
      setTask(prev => ({ ...prev, checklistItems: originalItems }));
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update checklist';
      setError(errorMessage);
    } finally {
      setUpdatingChecklist(false);
    }
  };

  // Check if user is paralegal (based on assignedTo)
  const isParalegal = () => {
    if (!task || !task.assignedTo) return false;
    // This assumes you have user info in context/store, or you can check from populated assignedTo
    // For now, we'll assume if task is assigned to a paralegal, the current user can edit
    return true; // You'll need to implement proper role checking
  };

  // Log form handlers (keep existing)
  const handleLogInputChange = (e) => {
    const { name, value } = e.target;
    setLogFormData(prev => ({
      ...prev,
      [name]: name === 'hoursSpent' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
  };

  const validateLogForm = () => {
    if (!logFormData.title.trim()) {
      setError('Log title is required');
      return false;
    }
    if (!logFormData.description.trim()) {
      setError('Log description is required');
      return false;
    }
    if (logFormData.hoursSpent < 0) {
      setError('Hours spent cannot be negative');
      return false;
    }
    if (logFormData.hoursSpent > 24) {
      setError('Hours spent cannot exceed 24 hours');
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogForm()) return;

    setSubmitting(true);
    try {
      let res;
      if (editingLog) {
        res = await apiClient.put(`/api/tasklogs/${taskId}/logs/${editingLog._id}`, logFormData);
        if (res.data.success) {
          setLogs(prev => prev.map(log =>
            log._id === editingLog._id ? res.data.data : log
          ));
          setEditingLog(null);
        } else {
          throw new Error(res.data.message);
        }
      } else {
        res = await apiClient.post(`/api/tasklogs/${taskId}/logs`, logFormData);
        if (res.data.success) {
          setLogs(prev => [res.data.data, ...prev]);
          setTotalHours(prev => prev + logFormData.hoursSpent);
        } else {
          throw new Error(res.data.message);
        }
      }

      setLogFormData({
        title: '',
        description: '',
        type: 'Research',
        hoursSpent: 0,
        status: 'Draft'
      });
      setShowAddLogForm(false);
      setError(null);
    } catch (err) {
      console.error('Error saving log:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save log';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditLog = (log) => {
    setEditingLog(log);
    setLogFormData({
      title: log.title,
      description: log.description,
      type: log.type,
      hoursSpent: log.hoursSpent,
      status: log.status
    });
    setShowAddLogForm(true);
  };

  const handleDeleteLog = async (logId, hoursSpent) => {
    if (!window.confirm('Are you sure you want to delete this log? This will adjust the task hours.')) {
      return;
    }

    try {
      const res = await apiClient.delete(`/api/tasklogs/${taskId}/logs/${logId}`);
      if (res.data.success) {
        setLogs(prev => prev.filter(log => log._id !== logId));
        setTotalHours(prev => prev - hoursSpent);
        setError(null);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error('Error deleting log:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete log';
      setError(errorMessage);
    }
  };

  const handleCancelLog = () => {
    setShowAddLogForm(false);
    setEditingLog(null);
    setLogFormData({
      title: '',
      description: '',
      type: 'Research',
      hoursSpent: 0,
      status: 'Draft'
    });
    setError(null);
  };

  // Status and type color classes
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

  // Safe data access helpers
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

  // Error state (no task)
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

  // Calculate checklist progress
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
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-4 py-3 mx-6 mt-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
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

                  {/* Checklist Progress */}
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
                          {totalHours.toFixed(1)}h
                        </p>
                        <p className="text-sm text-gray-500">
                          {logs.length} log{logs.length !== 1 ? 's' : ''}
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
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {task.description || 'No description provided'}
                    </p>
                  </div>
                </div>

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

                {/* Checklist Section */}
                {task.checklistItems && task.checklistItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-500 flex items-center">
                        <CheckCircle size={16} className="mr-2" />
                        Checklist ({checklistProgress.completed}/{checklistProgress.total})
                      </h4>
                      {isParalegal() && (
                        <span className="text-xs text-blue-600 font-medium">
                          Paralegal can update
                        </span>
                      )}
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {task.checklistItems.map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                            item.completed 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <button
                            onClick={() => handleChecklistToggle(index)}
                            disabled={updatingChecklist || !isParalegal()}
                            className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                              updatingChecklist || !isParalegal() 
                                ? 'cursor-not-allowed opacity-50' 
                                : item.completed 
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                  : 'bg-white text-gray-400 hover:bg-gray-100'
                            }`}
                            title={isParalegal() ? (item.completed ? 'Mark incomplete' : 'Mark complete') : 'Only paralegal can edit'}
                          >
                            {item.completed ? (
                              <CheckSquare size={20} />
                            ) : (
                              <Square size={20} />
                            )}
                          </button>
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

        {/* Right Panel: Working Logs - Keep existing log panel */}
        <main className="w-1/2 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-md font-semibold text-gray-900 flex items-center">
                  <CheckCircle size={20} className="mr-2 text-blue-600" />
                  Working Logs
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {logs.length}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Track your work sessions and time spent
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  <Clock size={16} className="mr-2" />
                  {totalHours.toFixed(1)}h total
                </div>
                <button
                  onClick={() => {
                    setShowAddLogForm(!showAddLogForm);
                    if (showAddLogForm && !editingLog) {
                      setLogFormData({
                        title: '',
                        description: '',
                        type: 'Research',
                        hoursSpent: 0,
                        status: 'Draft'
                      });
                    }
                  }}
                  disabled={submitting}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    showAddLogForm
                      ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {showAddLogForm ? (
                    <X size={16} className="mr-2" />
                  ) : (
                    <Plus size={16} className="mr-2" />
                  )}
                  {showAddLogForm ? 'Cancel' : 'Add Log'}
                </button>
              </div>
            </div>

            {/* Add/Edit Log Form */}
            {(showAddLogForm || editingLog) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingLog ? 'Edit Work Log' : 'Add New Work Log'}
                  </h3>
                  <button
                    onClick={handleCancelLog}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleLogSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={logFormData.title}
                      onChange={handleLogInputChange}
                      placeholder="What did you work on? (e.g., Research family law precedents)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={logFormData.description}
                      onChange={handleLogInputChange}
                      placeholder="Detailed description of work done, key findings, or progress made..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Type *
                      </label>
                      <select
                        name="type"
                        value={logFormData.type}
                        onChange={handleLogInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                        disabled={submitting}
                      >
                        <option value="Research">Research</option>
                        <option value="Drafting">Drafting</option>
                        <option value="Review">Review</option>
                        <option value="Filing">Filing</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Communication">Communication</option>
                        <option value="Administrative">Administrative</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hours Spent *
                      </label>
                      <input
                        type="number"
                        name="hoursSpent"
                        value={logFormData.hoursSpent}
                        onChange={handleLogInputChange}
                        min="0"
                        max="24"
                        step="0.1"
                        placeholder="0.0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelLog}
                      disabled={submitting}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>{editingLog ? 'Update Log' : 'Add Log'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Logs List */}
            <div className="space-y-4">
              {logs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No working logs yet
                  </h3>
                  <p className="text-gray-500">
                    Start tracking your progress by adding your first work log above
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
                          <h4 className="font-semibold text-gray-900 mb-2 truncate" title={log.title}>
                            {log.title}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(log.type)}`}>
                              {log.type}
                            </span>
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {new Date(log.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="flex items-center font-medium text-blue-600">
                              <User size={14} className="mr-1" />
                              {log.performedBy?.fullName || log.performedBy?.firstName || 'You'}
                            </span>
                          </div>

                          <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                            <Clock size={14} className="mr-1" />
                            {log.hoursSpent}h
                          </div>
                        </div>

                        {log.isAuthorizedToEdit &&  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleEditLog(log)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit log"
                            disabled={submitting}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteLog(log._id, log.hoursSpent)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete log"
                            disabled={submitting}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div> }
                        
                       
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {log.description}
                        </p>
                      </div>

                      {log.status && log.status !== 'Draft' && (
                        <div className="flex items-center justify-end">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status).replace('border-', '')}`}>
                            {log.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={fetchTaskData}
                disabled={loading || submitting || updatingChecklist}
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

      {showAddLogForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={handleCancelLog}>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default SingleTaskPage;