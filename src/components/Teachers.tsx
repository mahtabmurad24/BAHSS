import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function Teachers() {
  const [showAll, setShowAll] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  const allTeachers = useQuery(api.teachers.getPublicTeachers, { 
    department: selectedDepartment || undefined,
    limit: showAll ? 50 : 5
  });

  const departments = ["Science", "Arts", "Commerce", "Mathematics", "English", "Bangla"];

  if (!allTeachers) {
    return (
      <section id="teachers" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="teachers" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Our <span className="text-blue-600">Teachers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Meet our dedicated and experienced faculty members who are committed to providing quality education and shaping the future of our students.
          </p>
          
          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedDepartment("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedDepartment === ""
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Departments
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedDepartment === dept
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {allTeachers.map((teacher, index) => (
            <div
              key={teacher._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-4">
                {/* Teacher Image */}
                <div className="relative mb-4">
                  {teacher.imageUrl ? (
                    <img
                      src={teacher.imageUrl}
                      alt={teacher.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto border-4 border-blue-100">
                      <span className="text-white text-2xl font-bold">
                        {teacher.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Teacher Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                    {teacher.name}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm mb-1">
                    {teacher.designation}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                    {teacher.department}
                  </p>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <p><span className="font-medium">Qualification:</span> {teacher.qualification}</p>
                    <p><span className="font-medium">Experience:</span> {teacher.experience}</p>
                  </div>

                  {teacher.bio && (
                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                      {teacher.bio}
                    </p>
                  )}

                  {(teacher.email || teacher.phone) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {teacher.email && (
                        <p className="text-xs text-gray-500 mb-1">
                          📧 {teacher.email}
                        </p>
                      )}
                      {teacher.phone && (
                        <p className="text-xs text-gray-500">
                          📞 {teacher.phone}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {allTeachers.length >= 5 && (
          <div className="text-center animate-fadeInUp">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg btn-animate"
            >
              {showAll ? "Show Less" : `See All Teachers (${allTeachers.length}+)`}
            </button>
          </div>
        )}

        {allTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Teachers Available</h3>
            <p className="text-gray-600">
              {selectedDepartment 
                ? `No teachers found in ${selectedDepartment} department. Check back later for updates.`
                : "No teachers found. Check back later for updates."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}