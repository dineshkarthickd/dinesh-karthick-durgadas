import React, { useState, useEffect } from 'react';

interface ClockProps {
  className?: string;
}

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function formatCurrentTime(): string {
  try {
    return timeFormatter.format(new Date());
  } catch {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}

export const Clock: React.FC<ClockProps> = ({ className }) => {
  const [time, setTime] = useState<string>(formatCurrentTime);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const scheduleNextMinute = () => {
      setTime(formatCurrentTime());
      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;
      timerId = setTimeout(scheduleNextMinute, Math.max(500, msUntilNextMinute));
    };

    scheduleNextMinute();

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      className={
        className ||
        "font-['Barlow_Condensed'] font-bold text-white text-[28px] sm:text-[34px] tracking-wide leading-none select-none"
      }
      style={{ textShadow: '2px 2px 0 #000, 0 0 10px rgba(0,0,0,0.8)' }}
    >
      {time}
    </div>
  );
};
