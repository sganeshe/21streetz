import React, { useState, useEffect, useRef } from 'react';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=";

const HyperText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const scramble = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 2; // Adjust the speed of the scramble effect here
    }, 5); // Adjust the interval time here
  };

  return (
    <span 
      className={className} 
      onMouseEnter={scramble}
      onMouseLeave={() => {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }}
    >
      {displayText}
    </span>
  );
};

export default HyperText;