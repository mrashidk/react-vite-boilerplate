import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  const getReturnValues = (count) => {
    // calculate time left
    const days = Math.floor(count / (1000 * 60 * 60 * 24));
    const hours = Math.floor((count % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((count % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((count % (1000 * 60)) / 1000);

    return [days, hours, `0${minutes}`.slice(-2), `0${seconds}`.slice(-2), count];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

export default useCountdown;
