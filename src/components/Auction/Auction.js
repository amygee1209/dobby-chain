import React, {useState, useEffect} from 'react';
import './Auction.css';
import AuctionItem from './AuctionItem';
import axios from 'axios';
import { CircularProgress} from "@chakra-ui/react";
import Timer from './Timer';
import AuctionTimer from './AuctionTimer';

export default function Auction({address, onboardState}) {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myAuctionBidList, setMyAuctionBidList] = useState(false);

  const due = '05-05-2021 00:00:00';
  const dueDateTime = new Date(due);
  const diff = +dueDateTime - +new Date();

  const auctionEndTime = new Date(dueDateTime.getTime() + (24 * 60 * 60 * 1000))

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
      setLoading(false);
    }

    //Fetch my auction bid list
    console.log("fetching my auction bids...")
    //console.log(item.aid)
    const res2 = await axios
      .get(`https://dobchain-testing.herokuapp.com/myauctionbid?address=${address}`)
      .catch(err => {
        console.log("Error:", err)
      })
    if(res2) {
      console.log(res2.data)
      setMyAuctionBidList(res2.data)
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
  }
  )

   return (
    <div>
      {!onboardState.address ?
        <h2>Please connect your wallet</h2>
        :
        <div>
          {diff > 0?
            <Timer dueDateTime={dueDateTime} />
            :
            <div id="auction">
              <AuctionTimer auctionEndTime={auctionEndTime} />
              <div className="auction-notify">
              <p>*Colored box: Auctions items I've bid</p>
              </div>
              <div className="auction-content">
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
          
          
        </div>
        
      }
    </div>
  )
}