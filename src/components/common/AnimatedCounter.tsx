import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState<string | number>(value);

  useEffect(() => {
    const rawString = String(value);
    const numericMatch = rawString.match(/^([\d.]+)(.*)$/);

    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseFloat(numericMatch[1]);
    const suffix = numericMatch[2] || '';
    const isFloat = numericMatch[1].includes('.');
    const decimals = isFloat ? numericMatch[1].split('.')[1].length : 0;

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

      const currentNum = targetNum * easeProgress;
      const formattedNum = isFloat ? currentNum.toFixed(decimals) : Math.floor(currentNum);

      setDisplayValue(`${formattedNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};
