import { useState } from "react";

export function Developer() {
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const speeches = {
    en: `Dear Students and Faculty,
You are the future of our esteemed institution. Every challenge is a chance to grow stronger. Believe in yourself, stay focused, and work hard. Together, let’s build a legacy of excellence with courage and determination.
Thank you.`,
    bn: `প্রিয় ছাত্র-ছাত্রী ও শিক্ষকবৃন্দ,
আপনারাই আমাদের সম্মানিত প্রতিষ্ঠানের ভবিষ্যৎ। প্রতিটি চ্যালেঞ্জ আপনাকে আরও শক্তিশালী করার সুযোগ। নিজের উপর ভরসা রাখুন, লক্ষ্যে অটল থাকুন এবং অক্লান্ত পরিশ্রম করুন। আসুন, সাহস ও দৃঢ়তার সাথে শ্রেষ্ঠত্বের উত্তরাধিকার গড়ি।
ধন্যবাদ।`
  };

  // Placeholder image URL for the man who set up the school
  const principalImage = "https://i.ibb.co/27MMDxnK/Principal.jpg";

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "bn" : "en"));
  };

  return (
    <section
      id="developer"
      className="py-10 xs:py-12 sm:py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white"
    >
      <div className="container mx-auto px-3 xs:px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 xs:mb-12 sm:mb-16 animate-fadeInUp">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-4 xs:mb-6">
            Principal&apos;s <span className="text-pink-400">Speech</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto">
            {language === "en"
              ? "A message of inspiration and encouragement to our students and faculty."
              : "আমাদের ছাত্র-ছাত্রী ও শিক্ষকবৃন্দের জন্য অনুপ্রেরণা ও উৎসাহের বার্তা।"}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl animate-fadeInUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Principal Image */}
              <div className="text-center sm:text-left">
                <div className="relative inline-block">
                  <div className="w-24 sm:w-48 md:w-64 h-24 sm:h-48 md:h-64 mx-auto sm:mx-0 rounded-full overflow-hidden shadow-2xl ring-4 ring-pink-400/30">
                    <img
                      src={principalImage}
                      alt="School Founder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Speech Text */}
              <div className="text-indigo-100 leading-relaxed text-base sm:text-lg md:text-xl whitespace-pre-line">
                {speeches[language]}
                <div className="mt-6">
                  <button
                    onClick={toggleLanguage}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white font-semibold transition-colors duration-300"
                  >
                    {language === "en" ? "বাংলায় দেখুন" : "View in English"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
