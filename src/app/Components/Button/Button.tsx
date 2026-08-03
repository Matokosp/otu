"use client";

import React, { useState } from "react";

const Button = ({
  link,
  text,
  className,
  onClick,
  disabled
}: {
  link?: string;
  text: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
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

  const content = <>
    <span className="flex gap-x-[3px]">
      {text1.split(" ").map((word, index) => {
        const globalIndex = index; // Word index in text1
        return (
          <span
            key={index}
            className="opacity-100"
            style={{
              animation: hovering
                ? `${(order.indexOf(globalIndex) + 1) * 200
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
                ? `${(order.indexOf(globalIndex) + 1) * 200
                }ms hard-flicker steps(1) forwards`
                : "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  </>

  return (
    link ? (
      <a
        href={link ?? "#"}
        className={`w-full bg-black block text-white p-[10px] uppercase flex justify-between ${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ WebkitUserSelect: "none" }}
        onClick={onClick}
      >
        {/* Render text1 */}
        {content}
      </a>
    ) : link === undefined ? (
      <button
        className={`w-full bg-black block text-white p-[10px] uppercase flex justify-between ${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ WebkitUserSelect: "none" }}
        onClick={onClick}
        disabled={disabled}
      >
        {/* Render text1 */}
        {content}
      </button>
    ) : null
  )
};

export default Button;
