/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const DotSpinner = ({ size = "2.8rem", speed = "0.9s", color = "#183153" }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check if component is mounted on the client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent spinner rendering on the server
  }

  const dots = Array.from({ length: 8 });

  return (
    <>
      <div
        className="relative flex items-center justify-start"
        style={{
          "--uib-size": size,
          "--uib-speed": speed,
          "--uib-color": color,
          height: size,
          width: size,
        }}
      >
        {dots.map((_, index) => (
          <div
            key={index}
            className="absolute inset-0 flex items-center justify-start"
            style={{ transform: `rotate(${index * 45}deg)` }}
          >
            <div
              className="h-1/5 w-1/5 rounded-full opacity-50"
              style={{
                backgroundColor: color,
                animation: `pulse0112 calc(${speed} * 1.111) ease-in-out infinite`,
                animationDelay: `calc(${speed} * -${1 - index / 8})`,
                boxShadow: "0 0 20px rgba(18, 31, 53, 0.3)",
                willChange: "transform, opacity", // Hint to browser for optimized rendering
              }}
            ></div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse0112 {
          0%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default DotSpinner;
