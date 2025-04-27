import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ChevronDown, ChevronUp, Plus, X, Filter, ArrowUpDown, Shield, AlertOctagon, ShieldAlert } from 'lucide-react';
import { initialIncidents } from './incidents'; // importing incident data from file

export default function AISafetyDashboard() {

  // State management
  const [incidents, setIncidents] = useState(initialIncidents);
  const [expandedIds, setExpandedIds] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Medium",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...initialIncidents];
    
    // Apply severity filter
    if (severityFilter !== "All") {
      filtered = filtered.filter(incident => incident.severity === severityFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.reported_at);
      const dateB = new Date(b.reported_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    // Animation trigger
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 300);
    
    setIncidents(filtered);
    return () => clearTimeout(timer);
  }, [severityFilter, sortOrder]);

  // Initial animation
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Format date to more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle incident details
  const toggleDetails = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    return errors;
  };

  // Submit new incident
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const newIncident = {
      id: Math.max(...incidents.map(i => i.id)) + 1,
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      reported_at: new Date().toISOString()
    };
    
    // Add to both initial data and filtered view
    initialIncidents.push(newIncident);
    
    // Re-apply current filters
    let updatedIncidents = [...initialIncidents];
    if (severityFilter !== "All") {
      updatedIncidents = updatedIncidents.filter(incident => incident.severity === severityFilter);
    }
    updatedIncidents.sort((a, b) => {
      const dateA = new Date(a.reported_at);
      const dateB = new Date(b.reported_at);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    setIncidents(updatedIncidents);
    setFormData({ 
      title: "", 
      description: "", 
      severity: "Medium", 
    });
    setShowForm(false);
    
    // Auto-expand the newly added incident
    setExpandedIds(prev => [...prev, newIncident.id]);
  };

  // Get severity badge color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get severity background gradient
  const getSeverityGradient = (severity) => {
    switch (severity) {
      case "Low": return "from-blue-500 to-blue-600";
      case "Medium": return "from-yellow-500 to-yellow-600";
      case "High": return "from-red-500 to-red-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Low": return <Shield className="text-blue-700" size={16} />;
      case "Medium": return <AlertTriangle className="text-yellow-800" size={16} />;
      case "High": return <AlertOctagon className="text-red-700" size={16} />;
      default: return <AlertTriangle className="text-gray-700" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg shadow-md">
                <ShieldAlert size={28} className="text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Safety Incident Dashboard</h1>
                <p className="text-purple-100">Monitor and manage AI safety incidents</p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-md ${
                showForm 
                  ? 'bg-white text-purple-600 hover:bg-gray-100' 
                  : 'bg-purple-700 text-white hover:bg-purple-800'
              }`}
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? "Cancel" : "Report Incident"}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
        {/* Report Form */}
        {showForm && (
          <div className="mb-8 animate-slideDown">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 py-4 px-6">
                <h2 className="text-lg font-semibold text-white">Report New Incident</h2>
                <p className="text-purple-100 text-sm">Please provide detailed information about the safety incident</p>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Incident Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${formErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Brief title describing the incident"
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${formErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Provide detailed information about the incident"
                    ></textarea>
                    {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Low", "Medium", "High"].map(level => (
                        <label key={level} className="cursor-pointer">
                          <input
                            type="radio"
                            name="severity"
                            value={level}
                            checked={formData.severity === level}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`rounded-xl border-2 transition-all p-4 flex flex-col items-center ${
                            formData.severity === level 
                              ? `border-current ${getSeverityColor(level)}` 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={`rounded-full p-2 mb-2 ${
                              level === "Low" ? "bg-blue-100" : 
                              level === "Medium" ? "bg-yellow-100" : 
                              "bg-red-100"
                            }`}>
                              {getSeverityIcon(level)}
                            </div>
                            <span className="font-medium">{level}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl hover:from-purple-700 hover:to-blue-600 transition-colors shadow-md"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Controls section */}
        <div className="mb-8 flex flex-wrap items-center gap-4 p-4 bg-white rounded-2xl shadow-md">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <span className="font-medium text-gray-700">Filter by severity:</span>
            <div className="flex flex-wrap gap-2">
              {["All", "Low", "Medium", "High"].map(level => (
                <button
                  key={level}
                  onClick={() => setSeverityFilter(level)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    severityFilter === level 
                      ? level === "All" 
                        ? `bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md` 
                        : `bg-gradient-to-r ${getSeverityGradient(level)} text-white shadow-md`
                      : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                  }`}
                >
                  {level !== "All" && getSeverityIcon(level)}
                  <span>{level}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown size={18} className="text-gray-500" />
            <span className="font-medium text-gray-700">Sort:</span>
            <div className="flex gap-2">
              {[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortOrder(option.value)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    sortOrder === option.value 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Incidents Grid */}
        <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 ${isFiltering ? 'opacity-70 transition-opacity duration-300' : ''}`}>
          {incidents.length > 0 ? (
            incidents.map((incident, index) => (
              <div 
                key={incident.id} 
                className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1 ${
                  animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`h-2 bg-gradient-to-r ${getSeverityGradient(incident.severity)}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {getSeverityIcon(incident.severity)}
                      <span className="ml-1">{incident.severity}</span>
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{incident.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Clock size={14} className="mr-1" /> 
                    <span>{formatDate(incident.reported_at)}</span>
                  </div>
                  
                  {expandedIds.includes(incident.id) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 animate-expandDown">
                      <p className="text-gray-600 mb-3">{incident.description}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => toggleDetails(incident.id)}
                    className={`mt-4 w-full flex items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors border ${
                      expandedIds.includes(incident.id) 
                        ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white border-transparent hover:from-purple-700 hover:to-blue-600'
                    }`}
                  >
                    {expandedIds.includes(incident.id) ? (
                      <>Hide Details <ChevronUp size={16} /></>
                    ) : (
                      <>View Details <ChevronDown size={16} /></>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md">
              <p className="text-gray-500 text-lg mb-4">No incidents found matching your criteria</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setSeverityFilter("All"); }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors shadow-md"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </main>


      
      <style jsx global>{`
        @keyframes expandDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 500px; opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-expandDown {
          animation: expandDown 0.4s ease-out forwards;
          overflow: hidden;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}