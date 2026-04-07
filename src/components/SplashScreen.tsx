import { useState, useEffect } from "react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1600);
    const doneTimer = setTimeout(onDone, 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`splash ${fadeOut ? "splash-fade-out" : ""}`}>
      <div className="splash-content">
        <div className="splash-icon">
          <svg width="80" height="80" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="14" fill="#3b82f6" />
            <text
              x="24"
              y="33"
              textAnchor="middle"
              fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
              fontSize="28"
              fontWeight="700"
              fill="white"
            >
              K
            </text>
          </svg>
        </div>
        <h1 className="splash-title">Kash</h1>
        <p className="splash-tagline">Track your spending</p>
      </div>
    </div>
  );
}
