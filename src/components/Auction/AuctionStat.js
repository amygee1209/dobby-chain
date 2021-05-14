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

export default function AuctionStat({auctionEndTime, allBid, memBid, totalBidMem}) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  
  function getTimeLeft() {
    let diff = +auctionEndTime - +new Date();
    if (diff <= 500 && diff > -2000) {
      window.location.reload();
    }

    if (diff <= 1800500 && diff > 1798000) {
      window.location.reload();
    }

    const timeLeft = [Math.floor(diff / (1000 * 60 * 60 * 24)),
      Math.floor((diff / (1000 * 60 * 60)) % 24),
      Math.floor((diff / 1000 / 60) % 60),
      Math.floor((diff / 1000) % 60)
    ];
    return timeLeft;
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getTimeLeft());
      //console.log(getTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div id="auction-timer">
      <div className="timer-setting">
        {getTimeLeft()[2] < 0?
          <h1 style={{
            color: "rgb(243, 114, 114)",
            fontSize: "3.5vw",
            fontWeight: "500",
            textAlign: "center",
            padding: "3.5vh"
          }}>Auction Ended</h1>
          :
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
        }
        

        <Flex 
          flexDirection="column" 
          justifyContent="space-between" 
          width="40%"
          className="auction-stat"
        >
          <Stat>
            <StatLabel>Total Dobby Spent</StatLabel>
            <Flex
              flexDirection="row" 
              alignItems="baseline"
            >
              <StatNumber>{memBid}</StatNumber>
              <p>/{allBid}</p>
            </Flex>
            <StatHelpText>
              <StatArrow type="increase" />
              {parseFloat(memBid/allBid * 100).toFixed(2)}%
            </StatHelpText>
          </Stat>

          <Stat marginTop="3vh">
            <StatLabel>Number of people who bid</StatLabel>
            <Flex
              flexDirection="row" 
              alignItems="baseline" 
            >
              <StatNumber>{totalBidMem}</StatNumber>
              <p>/37</p>
            </Flex>
            
            <StatHelpText>
              <StatArrow type="increase" />
              {parseFloat(totalBidMem/37 * 100).toFixed(2)}%
            </StatHelpText>
          </Stat>
        </Flex>
      </div>
    </div>
  )
}