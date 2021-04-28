import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  InputGroup,
  InputLeftAddon,
  Input,
  Stack,
  CircularProgress
} from "@chakra-ui/react"
import { CheckIcon } from '@chakra-ui/icons'
import './AuctionItem.css';
import Timer from './Timer';
import axios from 'axios';

import web3 from "../ethereum/Web3";
import KSEA_Auction from "../../abis/KSEAuction.json";
import KseaToken from "../ethereum/KSEA_Token";
import { useSelector } from 'react-redux';

export default function AuctionItem({address, item, exist}) {
  const user = useSelector((state) => state.allUsers.selUser)
  const [inputBid, setInputBid] = useState('');
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState('');
  const [myBid, setMyBid] = useState('');
  const [bidStatus, setBidStatus] = useState(false);
  
  //design
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const toastIdRef = React.useRef()
  
  //auction
  const [auction, setAuction] = useState(undefined);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      let auction = await kseAuction();
      setAuction(auction);

      let token = await KseaToken();
      setToken(token);
    }
    fetchData();
  }, [])
  
  const fetchItemInfo = async () => {
    console.log("fetching item info...")
    //console.log(item.aid)
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/auction?aid=${item.aid}`)
      .catch(err => {
        console.log("Error:", err)
      })
    
    if(res) {
      console.log(res.data)
      setHighestBid(res.data.highestBid)
      setHighestBidder(res.data.highestBidder)
    }

    console.log("fetching my bid...")
    //console.log(item.aid)
    axios.get(`https://dobchain-testing.herokuapp.com/auctionbid?aid=${item.aid}&address=${address}`)
      .then(res => {
        console.log(res.data)
        setMyBid(res.data.myBid)
      })
      .catch(err => {
        console.log("Error:", err)
      })
  }

  useEffect(() => {
    fetchItemInfo();
  }, [item, highestBid, highestBidder])


  useEffect(() => {
    console.log("highest bid: " + highestBid);
    console.log("highest Bidder" + highestBidder);
  }, [highestBid, highestBidder])

  const kseAuction = async () => {
    if(item.contractAddr) {
    const auction = new web3.eth.Contract(KSEA_Auction.abi, item.contractAddr)
    //   console.log("airdrop address:", airdrop.options.address)

      return auction
    } else {
      // ***Devs*** uncomment this after deploying smart contracts
      // window.alert('Airdrop contract not deployed to detected network.')
      console.log('Smart contracts not deployed to detected network.')
    }
  }


  //Auction Contract interacting functions 
  async function makeBid(_amount) {
    await token.methods.approve(item.contractAddr, _amount).send({from:address});
    await auction.methods.bid(_amount).send({from:address})
    let getMyBid = await auction.methods.getBid(address).call();
    await getHighest().then(highest => {
      
      //Update highest bid and bidder
      console.log(highest[0], highest[1])
      let highestForm = new FormData();
      highestForm.append('aid', item.aid); 
      highestForm.append('highestBid', highest[0]); 
      highestForm.append('highestBidder', highest[1]);
      axios.put(`https://dobchain-testing.herokuapp.com/auction`, highestForm)
      .then(res => {
        console.log(res.data.highestBidder)
      })

      //Update my bid of the auction item
      let inputBidForm = new FormData();
      inputBidForm.append('aid', item.aid); 
      inputBidForm.append('inputBid', inputBid);
      inputBidForm.append('address', address);
      axios.post(`https://dobchain-testing.herokuapp.com/auctionbid`, inputBidForm)
      .then(res => {
        console.log(res.data.status)
      })
    });
    console.log("my bid: ", myBid);
    return true;
  }

  async function getHighest() {
    let highestBid = await auction.methods.getHighestBid().call();
    let highestBidder = await auction.methods.getHighestBidder().call();
    return [highestBid, highestBidder];
  }

  function handleChange(e) {
    setInputBid(e.target.value)
  }

  function handleSubmit() {
    if (inputBid <= 0) {
      toastIdRef.current = toast({ description: "너같으면 마이너스 배팅이 되겠냐? ㅡ.ㅡ" })
    } else {
      setBidStatus(true)
      makeBid(inputBid)
      .then(status => {
        console.log(status)
        if (status) {
          toastIdRef.current = toast({ description: "짝짝짝! 성공적으로 배팅하셨습니다!" })
          setInputBid('')
          setBidStatus(false)
        }}
      )
    }
  }

  const designClass = `auction-item bidded-item-${exist}`

  return (
    <div onClick={onOpen} className={designClass}>

      <img src={item.img} className="auction-item-img" alt="item img"/>
      <h1>{item.name}</h1>

      <Modal closeOnOverlayClick={false} size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="auction-item-box">
          <ModalHeader>{item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing="2vh">
              <img src={item.img} className="contractAddr-img" alt="item img"/>
              <h2>Auction Address:</h2>
              <h2>{item.contractAddr}</h2>
              <h2>Auction Id: {item.aid}</h2>
              <h2>Highest Bid: {highestBid} token(s)</h2>
              <h2>Highest Bidder: {highestBidder} </h2>
              <h2>My Bid: {myBid} token(s)</h2>
                <InputGroup>
                  <InputLeftAddon children="DOBBY"/>
                  <Input 
                    type="number"
                    value={inputBid}
                    placeholder="Your bid"
                    variant="filled"
                    onChange={handleChange}
                    style={{fontSize: "3vh"}}
                  />
                </InputGroup>
                {bidStatus?
                  <CircularProgress isIndeterminate color="blue.300" />
                  :
                  <Button 
                    onClick={handleSubmit}
                    rightIcon={<CheckIcon />} 
                    colorScheme="blue" 
                    variant="outline"
                    className="btn"
                  >
                    Bid
                  </Button>
                }
            </Stack>
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

