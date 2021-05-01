import React, {useState, useEffect} from 'react';
import './AuctionStat.css';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex
} from "@chakra-ui/react";

export default function AuctionStat({auctionEndTime, totalBid, totalBidMem}) {
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

        <Flex 
          flexDirection="column" 
          justifyContent="space-between" 
          width="40%"
          className="auction-stat"
        >
          <Stat>
            <StatLabel>Total Dobby spent</StatLabel>
            <Flex
              flexDirection="row" 
              alignItems="baseline"
            >
              <StatNumber>{totalBid}</StatNumber>
              <p>/1200</p>
            </Flex>
            <StatHelpText>
              <StatArrow type="increase" />
              {parseFloat(totalBid/1200 * 100).toFixed(2)}%
            </StatHelpText>
          </Stat>

          <Stat marginTop="3vh">
            <StatLabel>Number of people who bid on at least one item</StatLabel>
            <Flex
              flexDirection="row" 
              alignItems="baseline" 
            >
              <StatNumber>{totalBidMem}</StatNumber>
              <p>/58</p>
            </Flex>
            
            <StatHelpText>
              <StatArrow type="increase" />
              {parseFloat(totalBidMem/58 * 100).toFixed(2)}%
            </StatHelpText>
          </Stat>
        </Flex>
      </div>
    </div>
  )
}