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
  const [totalBid, setTotalBid] = useState('');
  const [totalBidMem, setTotalBidMem] = useState('');

  const due = '04-29-2021 00:00:00';
  const dueDateTime = new Date(due);
  const diff = +dueDateTime - +new Date();

  const auctionEndTime = new Date('06-01-2021 05:30:00')
  const auctionDiff = +auctionEndTime - +new Date();
  // const thirty = +new Date('04-30-2021 20:30:00') - +new Date('04-30-2021 20:00:00')
  // console.log(thirty)

  const fetchAllAuctions = async () => {
    //Fetch all auctions
    console.log("fetching all...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/auctions`)
      .catch(err => {
        console.log("Error:", err)
      })
    if(res) {
      console.log(res.data);
      const sorted = res.data.sort((a, b) => a.aid - b.aid);
      // sort auction items by
      setAuctions(sorted);
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

  //fetch total bids
  const fetchTotalBids = async () => {
    console.log("fetching total bids...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/totalauctionbids`)
      .catch(err => {
        console.log("Error:", err)
      })
    if(res) {
      console.log(res.data)
      setTotalBid(res.data);
    }
  }

  //fetch total number of people who bid on at least one item
  const fetchTotalBidMem = async () => {
    console.log("fetching total bids...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/totalbidmember`)
      .catch(err => {
        console.log("Error:", err)
      })
    if(res) {
      console.log(res.data)
      setTotalBidMem(res.data);
    }
  }

  useEffect(() => {
    fetchTotalBids();
    fetchTotalBidMem();
  }, [auctions, myAuctionBidList])

  const auctionItems = auctions.map(item => {
    let exist = false
    if (myAuctionBidList.length > 0 && myAuctionBidList.includes(item.aid)) {
      exist = true
    }
    return(
      <AuctionItem address={address} item={item} exist={exist} auctionDiff={auctionDiff} key={item.aid} />
    )
  })

   return (
    <>
      {diff > 0?
        <Timer dueDateTime={dueDateTime} />
        :
        <div id="auction">
          <AuctionStat 
            auctionEndTime={auctionEndTime} 
            totalBid={totalBid} 
            totalBidMem={totalBidMem}
          />
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