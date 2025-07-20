export function Developer() {
  const developer = {
    name: "Mahtaf Hossain",
    title: "Graphics Designer",
    description: "I’m a passionate graphics designer with a flair for creating visually stunning designs and a growing expertise in web development. I crafted this website for Badda Alatunnesa Higher Secondary School & College with creativity and dedication, blending aesthetics with functionality to showcase the institution’s excellence.",
    image: "https://i.ibb.co/Fkswd0J9/My-Image.png",
    skills: ["TypeScript", "Convex", "Tailwind CSS", "Node.js"],
    contact: {
      email: "info.mahtabmurad@gmail.com",
      behance: "https://www.behance.net/mahtafgfx",
      facebook: "https://www.facebook.com/mahtafgfx1",
      portfolio: "https://mahtafgfx.netlify.app/"
    }
  };

  return (
    <section id="developer" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet The <span className="text-pink-400">Developer</span>
          </h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Behind every great website is a passionate developer who brings ideas to life.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl animate-fadeInUp">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Developer Image */}
              <div className="text-center md:text-left">
                <div className="relative inline-block">
                  <div className="w-64 h-64 mx-auto md:mx-0 rounded-full overflow-hidden shadow-2xl ring-4 ring-pink-400/30">
                    <img
                      src={developer.image}
                      alt={developer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💻</span>
                  </div>
                </div>
              </div>

              {/* Developer Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {developer.name}
                  </h3>
                  <p className="text-xl text-pink-300 font-semibold mb-4">
                    {developer.title}
                  </p>
                  <p className="text-indigo-100 leading-relaxed">
                    {developer.description}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-pink-300">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {developer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-pink-300">Connect With Me:</h4>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={`mailto:${developer.contact.email}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    >
                      <img
                        src="https://i.ibb.co/67yGztjJ/mail.png"
                        alt="Email Icon"
                        className="w-5 h-5"
                      />
                      <span className="text-sm">Email</span>
                    </a>
                    <a
                      href={developer.contact.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    >
                      <img
                        src="https://i.ibb.co/nqNnvYng/behance-1.png"
                        alt="Behance Icon"
                        className="w-5 h-5"
                      />
                      <span className="text-sm">Behance</span>
                    </a>
                    <a
                      href={developer.contact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    >
                      <img
                        src="https://i.ibb.co/9mxF4sKH/facebook.png"
                        alt="Facebook Icon"
                        className="w-5 h-5"
                      />
                      <span className="text-sm">Facebook</span>
                    </a>
                    <a
                      href={developer.contact.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    >
                      <img
                        src="https://i.ibb.co/jZTjR61T/internet.png"
                        alt="Portfolio Icon"
                        className="w-5 h-5"
                      />
                      <span className="text-sm">Portfolio</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-12 text-center">
              <blockquote className="text-lg md:text-xl italic text-indigo-200 max-w-2xl mx-auto">
                "Building digital experiences that make a difference, one line of code at a time."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}