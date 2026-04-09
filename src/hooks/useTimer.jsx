import { useState, useEffect } from "react";

export default function useTimer(initialTime) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return { time, setTime, isRunning, setIsRunning };
}