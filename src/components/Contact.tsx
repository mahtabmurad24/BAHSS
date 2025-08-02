import { useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    branch: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branches = [
    {
      name: "Main Campus",
      address: "Alatunnesa School Rd, Dhaka 1212",
      phone: "9883066, 9895334, 8837393",
      email: "baddaalatunnesa@yahoo.com",
      isMain: true,
    },
    {
      name: "Boy's Campus",
      address: "Kha 66/3, Alatunnesa School Rd, Dhaka 1212",
      phone: "9883066, 9895334, 8837393",
      email: "baddaalatunnesa@yahoo.com",
      isMain: false,
    },
    {
      name: "Adarsha Nagar Campus",
      address: "Sekandarbagh, Adarsha Nagar, Dhaka-1212",
      phone: "9883066, 9895334, 8837393",
      email: "baddaalatunnesa@yahoo.com",
      isMain: false,
    },
  ];

  const generalInfo = [
    {
      icon: "🕒",
      title: "Office Hours",
      details: "Sunday - Thursday: 8:00 AM - 4:00 PM",
    },
    {
      icon: "🌐",
      title: "Website",
      details: "www.bahss.vercel.app",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.branch || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mdkdkoaj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          branch: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Formspree submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-10 xs:py-12 sm:py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 xs:mb-12 sm:mb-16 animate-fadeInUp">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-4 xs:mb-6">
            Get In <span className="text-blue-400">Touch</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            We're here to help and answer any questions you might have. Visit any of our three branches or contact us online.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-12">
          {/* Contact Information */}
          <div className="space-y-4 xs:space-y-6 sm:space-y-8 animate-fadeInLeft">
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-4 xs:mb-6 sm:mb-8">Our Locations</h3>

            {/* Branches */}
            {branches.map((branch, index) => (
              <div
                key={index}
                className={`p-3 xs:p-4 sm:p-6 rounded-xl transition-all duration-300 ${
                  branch.isMain
                    ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-2 border-blue-400/50"
                    : "bg-white/10 hover:bg-white/20"
                } backdrop-blur-sm`}
              >
                <div className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4">
                  <div className="text-xl xs:text-2xl sm:text-3xl">
                    {branch.isMain ? "🏫" : "🏢"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-base xs:text-lg sm:text-xl font-semibold">{branch.name}</h4>
                      {branch.isMain && (
                        <span className="px-2 py-1 bg-blue-500 text-xs rounded-full">Main</span>
                      )}
                    </div>
                    <div className="space-y-1 xs:space-y-2 text-blue-100 text-xs xs:text-sm sm:text-base">
                      <div className="flex items-center space-x-2">
                        <span>📍</span>
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>📞</span>
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✉️</span>
                        <span>{branch.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* General Information */}
            {generalInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4 p-3 xs:p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-xl xs:text-2xl sm:text-3xl">{info.icon}</div>
                <div>
                  <h4 className="text-base xs:text-lg sm:text-xl font-semibold mb-2">{info.title}</h4>
                  <p className="text-blue-100 text-xs xs:text-sm sm:text-base">{info.details}</p>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="mt-4 xs:mt-6 sm:mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-3 xs:p-4 sm:p-6">
              <h4 className="text-base xs:text-lg sm:text-xl font-semibold mb-3 xs:mb-4">Main Campus Location</h4>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4535.44607883001!2d90.4203386761525!3d23.776720678652538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c726e4206547%3A0x7a7e835c57fe40da!2sBadda%20Alatunnessa%20Higher%20Secondary%20School(Boy's%20section%20)!5e1!3m2!1sen!2sbd!4v1752752741176!5m2!1sen!2sbd"
                width="100%"
                height="150"
                className="xs:h-[200px] sm:h-[250px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fadeInRight">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 xs:p-6 sm:p-8">
              <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-4 xs:mb-6 sm:mb-8">Send us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white text-xs xs:text-sm sm:text-base"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white text-xs xs:text-sm sm:text-base"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white text-xs xs:text-sm sm:text-base"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2">Branch of Interest</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white text-xs xs:text-sm sm:text-base"
                    required
                  >
                    <option value="" className="text-gray-800">
                      Select a branch
                    </option>
                    {branches.map((branch, index) => (
                      <option key={index} value={branch.name} className="text-gray-800">
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white text-xs xs:text-sm sm:text-base"
                    placeholder="What is this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1 xs:mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white resize-none text-xs xs:text-sm sm:text-base"
                    placeholder="Your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none text-xs xs:text-sm sm:text-base"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}