import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  tiltAmount = 10,
  onClick
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -tiltAmount;
    const rY = ((x - centerX) / centerX) * tiltAmount;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative transition-shadow duration-300 ${className}`}
    >
      {/* Dynamic Cursor Glare Effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          opacity: glarePos.opacity
        }}
      />
      {children}
    </motion.div>
  );
};
