import React, {useState, useEffect} from 'react';
import './Timer.css';

export default function Timer({ dueDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    let diff = +dueDate - +new Date();
    let timeLeft = {};

    if (diff > 0) {
      timeLeft = [Math.floor(diff / (1000 * 60 * 60 * 24)),
        Math.floor((diff / (1000 * 60 * 60)) % 24),
        Math.floor((diff / 1000 / 60) % 60),
        Math.floor((diff / 1000) % 60)
      ];
    }
    return timeLeft;
  }
  
  useEffect(() => {
  const timer = setTimeout(() => {
    setTimeLeft(getTimeLeft());
  }, 1000);
  return () => clearTimeout(timer);
});

  return (
    <div id="timer">
      <h3>
        You have {timeLeft[0]} day(s)
        <br/>
        {timeLeft[1]}: {timeLeft[2]}: {timeLeft[3]} left
      </h3>
    </div>
  )
}