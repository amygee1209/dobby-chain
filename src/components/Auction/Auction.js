import React, {useState, useEffect} from 'react';
import './Auction.css';
import AuctionItem from './AuctionItem';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CircularProgress} from "@chakra-ui/react"

export default function Auction({address, onboardState}) {
  const user = useSelector((state) => state.allUsers.selUser)
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myAuctionBidList, setMyAuctionBidList] = useState(false);

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
  }, [user, address])

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
        <div id="auction">
          <div className="auction-notify">
            <p>Colored box: Auctions items that I've bidded</p>
            <p>white box: Auctions items that I haven't bidded</p>
          </div>
          <div className="auction-content">
            <div className="user-info">
              <div className="my-ranking">
                <img src={user.img} id="my-img" alt="headshot"/>
                <p>{user.name}</p>
                <p>{user.num_points} points</p>
              </div>
              
            </div>
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
  )
}