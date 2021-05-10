import React, {useState, useEffect} from 'react';
import './Auction.css';
import AuctionItem from './AuctionItem';
import axios from 'axios';
import { 
  CircularProgress, 
  HStack,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import Timer from './Timer';
import AuctionStat from './AuctionStat';
import FAQ from './FAQ';

export default function Auction({address}) {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myAuctionBidList, setMyAuctionBidList] = useState(false);
  const [memBid, setMemBid] = useState('');
  const [totalBidMem, setTotalBidMem] = useState('');
  const [allBid, setAllBid] = useState('');

  // auction start datetime
  const due = '05-10-2021 15:20:00';
  const dueDateTime = new Date(due);
  const diff = +dueDateTime - +new Date();

  // auction end datetime
  const auctionEndTime = new Date('05-11-2021 15:20:00')
  const auctionDiff = +auctionEndTime - +new Date();


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
      //console.log(res.data)
      setMyAuctionBidList(res.data);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllAuctions();
  }, [address, loading])

  //fetch all bids
  const fetchAllBid = async () => {
    console.log("fetching all bids...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/allbids`)
      .catch(err => {
        console.log("Error:", err)
      })
    if(res) {
      console.log(res.data)
      setAllBid(res.data);
    }
  }

  //fetch all members bids
  const fetchMemBids = async () => {
    console.log("fetching All Members bids...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/totalauctionbids`)
      .catch(err => {
        console.log("Error:", err)
      })
    if(res) {
      //console.log(res.data)
      setMemBid(res.data);
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
      //console.log(res.data)
      setTotalBidMem(res.data);
    }
  }

  useEffect(() => {
    fetchAllBid();
    fetchMemBids();
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
            allBid={allBid}
            memBid={memBid} 
            totalBidMem={totalBidMem}
          />
          <hr style={{marginBottom: "4vh"}}/>
          <div className="auction-notify">
          <HStack>
            <p>Colored line</p>
            <Tooltip hasArrow label="Colored line indicates that you've bid" bg="gray.300" color="black">
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
      <Accordion
        allowMultiple
        style={{marginTop: "200px"}}
      >
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box 
                flex="1" 
                textAlign="left"
                fontSize="3vh"
                fontWeight="500"
                padding="1vh"
                color="#FFA116"
              >
                Frequently Asked Questions
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <FAQ/>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}