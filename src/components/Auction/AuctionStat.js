import React, {useState, useEffect} from 'react';
import './AuctionStat.css';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Flex
} from "@chakra-ui/react";

export default function AuctionStat({auctionEndTime}) {
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
    <div id="auction-timer">
      <div className="timer-setting">
        <Flex justifyContent="space-between" width="45%">
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
        </Flex>

        <Flex flexDirection="column" justifyContent="space-between" width="40%">
          <Stat>
            <StatLabel>Total Dobby spent</StatLabel>
            <StatNumber>345,670</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Number of people who bid on at least one item</StatLabel>
            <StatNumber>45</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              9.05%
            </StatHelpText>
          </Stat>
        </Flex>
      </div>
    </div>
  )
}