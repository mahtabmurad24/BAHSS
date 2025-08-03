export function Academics() {
  const programs = [
    {
      level: "Primary",
      grades: "Class I - V",
      description: "Foundation building with focus on basic literacy, numeracy, and character development.",
      subjects: ["English", "Bangla", "Mathematics", "Science", "Social Studies"],
      color: "from-green-400 to-blue-500"
    },
    {
      level: "Secondary",
      grades: "Class VI - X",
      description: "Comprehensive education preparing students for higher secondary studies.",
      subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Bangla"],
      color: "from-blue-400 to-purple-500"
    },
    {
      level: "Higher Secondary",
      grades: "Class XI - XII (Only Girls)",
      description: "Specialized streams preparing students for university admission.",
      subjects: ["Science", "Commerce", "Arts", "Business Studies"],
      color: "from-purple-400 to-pink-500"
    }
  ];

  const facilities = [
    {
      icon: "🔬",
      name: "Science Labs",
      description: "Well-equipped physics, chemistry, and biology laboratories"
    },
    {
      icon: "💻",
      name: "Computer Lab",
      description: "Modern computer lab with high-speed internet connectivity"
    },
    {
      icon: "📚",
      name: "Library",
      description: "Extensive collection of books, journals, and digital resources"
    },
    {
      icon: "🎨",
      name: "Art Studio",
      description: "Creative space for art, craft, and cultural activities"
    },
    {
      icon: "🍽️",
      name: "Canteen",
      description: "Hygienic and nutritious meal facilities for students and staff"
    },
    {
      icon: "🎭",
      name: "Auditorium",
      description: "Modern auditorium for events, seminars, and cultural programs"
    }
  ];

  return (
    <section id="academics" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Academic <span className="text-blue-600">Programs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive academic programs are designed to provide students with 
            a strong foundation and prepare them for future success.
          </p>
        </div>

        {/* Programs */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {programs.map((program, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`h-2 bg-gradient-to-r ${program.color}`} />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {program.level}
                </h3>
                <p className="text-blue-600 font-semibold mb-4">{program.grades}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {program.description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Key Subjects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fadeInUp">
            World-Class <span className="text-blue-600">Facilities</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {facility.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {facility.name}
                </h4>
                <p className="text-gray-600">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
