import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Notices } from "./Notices";
import { Academics } from "./Academics";
import { Teachers } from "./Teachers";
import { Gallery } from "./Gallery";
import { Contact } from "./Contact";
import { Developer } from "./Developer";
import { Footer } from "./Footer";
import { LiveChat } from "./LiveChat";

export function SchoolWebsite() {
  const [activeSection, setActiveSection] = useState("home");
  const [showGoToTop, setShowGoToTop] = useState(false);
  const notices = useQuery(api.notices.getPublicNotices, { limit: 10 });
  const teachers = useQuery(api.teachers.getPublicTeachers, { limit: 20 });
  const gallery = useQuery(api.gallery.getPublicGallery, { limit: 20 });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "academics", "teachers", "gallery", "notices", "contact", "developer"];
      const scrollPosition = window.scrollY + 100;

      setShowGoToTop(window.scrollY > 300);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div style={{ display: 'none' }}>
        <h1>Badda Alatunnesa Higher Secondary School & College - Best School in Dhaka Bangladesh</h1>
        <meta name="description" content="Badda Alatunnesa Higher Secondary School & College is a premier educational institution in Dhaka, Bangladesh offering quality education from primary to higher secondary level with experienced teachers and modern facilities." />
        <meta name="keywords" content="Badda Alatunnesa School, Higher Secondary School Dhaka, Best School Bangladesh, Education Dhaka, School Admission Bangladesh, Quality Education, Academic Excellence" />
        <meta name="author" content="Badda Alatunnesa Higher Secondary School & College" />
        <meta property="og:title" content="Badda Alatunnesa Higher Secondary School & College - Excellence in Education" />
        <meta property="og:description" content="Premier educational institution in Dhaka offering quality education with experienced faculty and modern facilities." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Badda Alatunnesa Higher Secondary School & College" />
        <meta name="twitter:description" content="Excellence in Education - Quality learning environment in Dhaka, Bangladesh" />
      </div>

      <div className="min-h-screen">
        <Header activeSection={activeSection} />
        <main>
          <Hero />
          <About />
          <Academics />
          {teachers === undefined ? (
            <div className="p-6 text-center">Loading teachers...</div>
          ) : teachers === null ? (
            <div className="p-6 text-center text-red-600">Failed to load teachers</div>
          ) : (
            <Teachers />
          )}
          {gallery === undefined ? (
            <div className="p-6 text-center">Loading gallery...</div>
          ) : gallery === null ? (
            <div className="p-6 text-center text-red-600">Failed to load gallery</div>
          ) : (
            <Gallery />
          )}
          {notices === undefined ? (
            <div className="p-6 text-center">Loading notices...</div>
          ) : notices === null ? (
            <div className="p-6 text-center text-red-600">Failed to load notices</div>
          ) : (
            <Notices />
          )}
          <Contact />
          <Developer />
        </main>
        <Footer />
        <LiveChat />
        {showGoToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 animate-bounce"
            aria-label="Go to top"
          >
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}