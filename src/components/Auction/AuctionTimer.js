import React, {useState, useEffect} from 'react';
import './Timer.css';

export default function AuctionTimer({auctionEndTime}) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  
  function getTimeLeft() {
    let diff = +auctionEndTime - +new Date();
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
      <div id="timer-setting">
        <div className="time-box">
          {timeLeft[1] < 10?
            <h3>0{timeLeft[1]}</h3>
            :
            <h3>{timeLeft[1]}</h3>
          }
          <br/>
          <p>HOUR</p>
        </div>
        <div className="time-box">
          {timeLeft[2] < 10?
            <h3>0{timeLeft[2]}</h3>
            :
            <h3>{timeLeft[2]}</h3>
          }
          <br/>
          <p>MINUTE</p>
        </div>
        <div className="time-box">
          {timeLeft[3] < 10?
            <h3>0{timeLeft[3]}</h3>
            :
            <h3>{timeLeft[3]}</h3>
          }
          <br/>
          <p>SECOND</p>
        </div>
      </div>
    </div>
  )
}