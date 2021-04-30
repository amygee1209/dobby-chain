import React, {useState, useEffect} from 'react';
import './Auction.css';
import AuctionItem from './AuctionItem';
import axios from 'axios';
import { 
  CircularProgress, 
  HStack,
  Tooltip
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import Timer from './Timer';
import AuctionStat from './AuctionStat';

export default function Auction({address}) {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myAuctionBidList, setMyAuctionBidList] = useState(false);

  const due = '04-29-2021 00:00:00';
  const dueDateTime = new Date(due);
  const diff = +dueDateTime - +new Date();

  // dueDateTime.getTime() + (24 * 60 * 60 * 1000)
  const auctionEndTime = new Date('05-10-2021 00:00:00')

  const fetchAllAuctions = async () => {
    //Fetch all auctions
    console.log("fetching all...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/auctions`)
      .catch(err => {
        console.log("Error:", err)
      })
    if(res) {
      console.log(res.data)
      setAuctions(res.data);
    }
    fetchMyAuctionBids();
  }

  const fetchMyAuctionBids = async () => {
    console.log("fetching my auction bids...")
    //console.log(item.aid)
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/myauctionbid?address=${address}`)
      .catch(err => {
        console.log("Error:", err)
      })
    if(res) {
      console.log(res.data)
      setMyAuctionBidList(res.data);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllAuctions();
  }, [address, loading])

  const auctionItems = auctions.map(item => {
    let exist = false
    if (myAuctionBidList.length > 0 && myAuctionBidList.includes(item.aid)) {
      exist = true
    }
    return(
      <AuctionItem address={address} item={item} exist={exist} key={item.aid} />
    )
  })

   return (
    <>
      {diff > 0?
        <Timer dueDateTime={dueDateTime} />
        :
        <div id="auction">
          <AuctionStat auctionEndTime={auctionEndTime} />
          <div className="auction-notify">
          <HStack>
            <p>Colored box</p>
            <Tooltip hasArrow label="Colored boxes are items I bid" bg="gray.300" color="black">
              <QuestionOutlineIcon/>
            </Tooltip>
          </HStack>
          </div>
          <div className="auction-items-list">
            {loading?
              <CircularProgress isIndeterminate color="blue.300" />
              :
              <div className="auction-items">
                {auctionItems}
              </div>
            }
          </div>
        </div>
      }
    </>
  )
}