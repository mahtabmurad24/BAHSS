import { useState, useEffect } from "react";

export function FindOnlineResultButton() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Initial delay before showing text (5 to 10 seconds)
    const initialDelay = 7000; // 7 seconds as midpoint

    // Duration text stays visible
    const visibleDuration = 10000; // 10 seconds

    // Interval between text show cycles
    const cycleInterval = 60000; // 1 minute

    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startCycle = () => {
      showTimeout = setTimeout(() => {
        setShowText(true);
        hideTimeout = setTimeout(() => {
          setShowText(false);
        }, visibleDuration);
      }, initialDelay);
    };

    startCycle();

    intervalId = setInterval(() => {
      startCycle();
    }, cycleInterval);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <a
      href="https://example.com/online-result"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-8 bottom-24 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2 px-4 py-2 transform hover:scale-110"
      aria-label="Find Online Result"
      title="Find Online Result"
      style={{ flexDirection: "row" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {showText && (
        <span className="text-sm font-semibold animate-bounce animate-fadeInOut transition-colors duration-1000 ease-in-out">
          Online Result
        </span>
      )}
    </a>
  );
}
