"use client";

import React, { useState } from "react";

const Button = ({
  link,
  text,
  className,
}: {
  link?: string;
  text: string;
  className?: string;
}) => {
  const [text1, text2] = text.split("|");
  const words = [...text1.split(" "), ...text2.split(" ")]; // Combine all words
  const [order, setOrder] = useState<number[]>([]); // Randomized order of words
  const [hovering, setHovering] = useState(false);

  // Randomize the order of word indices
  const randomizeOrder = () => {
    const indices = Array.from({ length: words.length }, (_, i) => i); // Ensure all indices are included
    return indices.sort(() => Math.random() - 0.5); // Shuffle all indices
  };

  const handleMouseEnter = () => {
    setOrder(randomizeOrder()); // Generate a random order
    setHovering(true); // Trigger animation
  };

  const handleMouseLeave = () => {
    setHovering(false); // Reset animation
  };

  return (
    link && (
      <a
        href={link}
        className={`w-full bg-black block text-white p-[10px] uppercase flex justify-between ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Render text1 */}
        <span className="flex gap-2">
          {text1.split(" ").map((word, index) => {
            const globalIndex = index; // Word index in text1
            return (
              <span
                key={index}
                className="opacity-100"
                style={{
                  animation: hovering
                    ? `${
                        (order.indexOf(globalIndex) + 1) * 200
                      }ms hard-flicker steps(1) forwards`
                    : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
        {/* Render text2 */}
        <span className="flex gap-x-[3px]">
          {text2.split(" ").map((word, index) => {
            const globalIndex = text1.split(" ").length + index; // Word index in text2
            return (
              <span
                key={index}
                className="opacity-100"
                style={{
                  animation: hovering
                    ? `${
                        (order.indexOf(globalIndex) + 1) * 200
                      }ms hard-flicker steps(1) forwards`
                    : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      </a>
    )
  );
};

export default Button;
