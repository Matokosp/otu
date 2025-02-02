"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function Typing({ text = "Typing Effect" }: { text: string }) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const textParts: any = text.split("<br>");

  return (
    <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {textParts.map((line: string, idx: number) => {
        return (
          <React.Fragment key={idx + line}>
            {line.split("").map((letter, index) => {
              return (
                <motion.span
                  key={index + idx}
                  initial={{ opacity: 1 }}
                  animate={
                    isHovered
                      ? {
                          opacity: [0, 1],
                          transition: {
                            opacity: { duration: 0, delay: index * 0.09 },
                          },
                        }
                      : { opacity: 1 }
                  }
                >
                  {letter}
                </motion.span>
              );
            })}
            <br />
          </React.Fragment>
        );
      })}
    </span>
  );
}
