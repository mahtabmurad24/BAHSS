import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function Notices() {
  const [showAll, setShowAll] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");
  
  const allNotices = useQuery(api.notices.getPublicNotices, { 
    priority: selectedPriority || undefined,
    limit: showAll ? 50 : 5
  });

  const priorities = [
    { value: "high", label: "High Priority", color: "text-red-600" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-600" },
    { value: "low", label: "Low Priority", color: "text-green-600" }
  ];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "📢";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (!allNotices) {
    return (
      <section id="notices" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="notices" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Latest <span className="text-blue-600">Notices</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay updated with the latest announcements, events, and important information from our school.
          </p>
          
          {/* Priority Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedPriority("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedPriority === ""
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              }`}
            >
              All Notices
            </button>
            {priorities.map((priority) => (
              <button
                key={priority.value}
                onClick={() => setSelectedPriority(priority.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedPriority === priority.value
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                }`}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="space-y-6 mb-12">
          {allNotices.map((notice, index) => (
            <div
              key={notice._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeInUp card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getPriorityIcon(notice.priority)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {notice.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                        </span>
                        <span className="text-sm text-gray-500">
                          📅 {formatDate(notice.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {allNotices.length >= 5 && (
          <div className="text-center animate-fadeInUp">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg btn-animate"
            >
              {showAll ? "Show Less" : `See All Notices (${allNotices.length}+)`}
            </button>
          </div>
        )}

        {allNotices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Notices Available</h3>
            <p className="text-gray-600">
              {selectedPriority 
                ? `No ${selectedPriority} priority notices found. Check back later for updates.`
                : "No notices found. Check back later for updates."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}