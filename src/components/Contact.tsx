import { useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    branch: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branches = [
    {
      name: "Main Campus",
      address: "Alatunnesa School Rd, Dhaka 1212",
      phone: "9883066, 9895334, 8837393",
      email: "main@baddaalatunnesa.edu.bd",
      isMain: true
    },
    {
      name: "Boy's Campus",
      address: "Kha 66/3, Alatunnesa School Rd, Dhaka 1212", 
      phone: "9883066, 9895334, 8837393",
      email: "Boys@baddaalatunnesa.edu.bd",
      isMain: false
    },
    {
      name: "Adarsha Nagar Campus",
      address: "Sekandarbagh , Adarsha Nagar, Dhaka-1212",
      phone: "9883066, 9895334, 8837393", 
      email: "adarshanagar@baddaalatunnesa.edu.bd",
      isMain: false
    }
  ];

  const generalInfo = [
    {
      icon: "🕒",
      title: "Office Hours",
      details: "Sunday - Thursday: 8:00 AM - 4:00 PM"
    },
    {
      icon: "🌐",
      title: "Website",
      details: "www.bahss.netlify.app"
    }
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
          message: ""
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="text-blue-400">Touch</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're here to help and answer any questions you might have. 
            Visit any of our three branches or contact us online.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-fadeInLeft">
            <h3 className="text-3xl font-bold mb-8">Our Locations</h3>
            
            {/* Branches */}
            {branches.map((branch, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  branch.isMain 
                    ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-2 border-blue-400/50" 
                    : "bg-white/10 hover:bg-white/20"
                } backdrop-blur-sm`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">
                    {branch.isMain ? "🏫" : "🏢"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-xl font-semibold">{branch.name}</h4>
                      {branch.isMain && (
                        <span className="px-2 py-1 bg-blue-500 text-xs rounded-full">Main</span>
                      )}
                    </div>
                    <div className="space-y-2 text-blue-100">
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
                className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-3xl">{info.icon}</div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">{info.title}</h4>
                  <p className="text-blue-100">{info.details}</p>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4">Main Campus Location</h4>
              <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4535.44607883001!2d90.4203386761525!3d23.776720678652538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c726e4206547%3A0x7a7e835c57fe40da!2sBadda%20Alatunnessa%20Higher%20Secondary%20School(Boy's%20section%20)!5e1!3m2!1sen!2sbd!4v1752752741176!5m2!1sen!2sbd"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fadeInRight">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-8">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} action="https://formspree.io/f/mdkdkoaj" method="POST" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Branch of Interest</label>
                  <select 
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white"
                    required
                  >
                    <option value="" className="text-gray-800">Select a branch</option>
                    {branches.map((branch, index) => (
                      <option key={index} value={branch.name} className="text-gray-800">
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white"
                    placeholder="What is this about?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/70 text-white resize-none"
                    placeholder="Your message here..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none"
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