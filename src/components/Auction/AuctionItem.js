import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  InputGroup,
  InputLeftAddon,
  Input, Tooltip,
  Alert, AlertIcon, AlertTitle, AlertDescription,
  Flex, Box,
  CloseButton,
  HStack
} from "@chakra-ui/react";
import { 
  QuestionOutlineIcon,
  CheckIcon
} from '@chakra-ui/icons';
import './AuctionItem.css';
import axios from 'axios';
import defaultImg from './../../img/default.jpg';

import web3 from "../ethereum/Web3";
import KSEA_Auction from "../../abis/KSEAuction.json";
import KseaToken from "../ethereum/KSEA_Token";
import Notify from 'bnc-notify';

const notify = Notify({
  dappId: 'a26b3ed4-031c-40da-bbf7-cf3f1f0ee190',
  networkId: 4
});

export default function AuctionItem({address, item, auctionDiff, exist}) {
  const [inputBid, setInputBid] = useState('');
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState('');
  const [highestBidderPic, setHighestBidderPic] = useState('');
  const [myBid, setMyBid] = useState('');
  const [bidStatus, setBidStatus] = useState(false);
  const [bidDisable, setBidDisable] = useState(true);
  
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
    axios.get(`https://dobchain-testing.herokuapp.com/auction?aid=${item.aid}`)
      .then(res => {
        console.log(res.data)
        setHighestBid(res.data.highestBid)
        setHighestBidder(res.data.highestBidder)
        if (res.data.highestBidderPic === '') {
          setHighestBidderPic(defaultImg)
        } else {
          setHighestBidderPic(res.data.highestBidderPic)
        }
        
      })
      .catch(err => {
        console.log("Error:", err)
      })

    console.log("fetching my bid...")
    //console.log(item.aid)
    axios.get(`https://dobchain-testing.herokuapp.com/auctionbid?aid=${item.aid}&address=${address}`)
      .then(res => {
        //console.log(res.data)
        setMyBid(res.data.myBid)
      })
      .catch(err => {
        console.log("Error:", err)
      })
  }

  useEffect(() => {
    fetchItemInfo();
  }, [item, address, bidStatus, inputBid])

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
    await token.methods.approve(item.contractAddr, _amount).send({from:address})
    .on("transactionHash", hash => {
      notify.hash(hash);
    })
    .on('error', function(error, receipt) {
      toastIdRef.current = toast({
        title: "Error",
        description: "Transaction Rejected",
        status: "error",
        duration: 10000,
        isClosable: true,
      })
      setBidStatus(false);
    });
    
    await auction.methods.bid(_amount).send({from:address})
     .on("transactionHash", hash => {
      notify.hash(hash);
    })
    .on('error', function(error, receipt) {
      toastIdRef.current = toast({
        title: "Error",
        description: "Transaction Rejected",
        status: "error",
        duration: 10000,
        isClosable: true,
      })
      setBidStatus(false);
    });
    
    await getHighest().then(highest => {
      //Update highest bid and bidder
      // console.log("bid info: ", highest[0], highest[1], highest[2])
      let highestForm = new FormData();
      highestForm.append('aid', item.aid); 
      highestForm.append('highestBid', highest[0]); 
      highestForm.append('highestBidder', highest[1]);
      axios.put(`https://dobchain-testing.herokuapp.com/auction`, highestForm)
        .then(res => {
          // console.log(res.data.highestBidder)
          updateMyBid(highest[2]);
        })
      });
  }
    
  function updateMyBid(updatedMyBid) {
    // console.log("My updated bid:", updatedMyBid)
    let inputBidForm = new FormData();
    inputBidForm.append('aid', item.aid); 
    inputBidForm.append('inputBid', updatedMyBid);
    inputBidForm.append('address', address);
    axios.post(`https://dobchain-testing.herokuapp.com/auctionbid`, inputBidForm)
      .then(status => {
        console.log(status)
        if (status) {
          toastIdRef.current = toast({
            title: "Success",
            description: "배팅 성공! 묻고 더블로 가!",
            status: "success",
            duration: 10000,
            isClosable: true,
          })
          setBidStatus(false);
          handleClose();
          window.location.reload();
        }
      })
  }

  async function getHighest() {
    let highestBid = await auction.methods.getHighestBid().call();
    let highestBidder = await auction.methods.getHighestBidder().call();
    let mybid = await auction.methods.getBid(address).call();
    if (typeof highestBid == "undefined") {
      setTimeout(async () => {
        highestBid = await auction.methods.getHighestBid().call();
      }, 500);
    }
    if (typeof highestBidder == "undefined") {
      setTimeout(async () => {
        highestBidder = await auction.methods.getHighestBidder().call();
      }, 500);
    }
    if (typeof mybid == "undefined") {
      setTimeout(async () => {
        mybid = await auction.methods.getBid(address).call();
      }, 500);
    }
    if (typeof highestBid != "undefined" && typeof highestBidder != "undefined" && typeof mybid != "undefined") {
      return [highestBid, highestBidder, mybid];
    }
    
  }

  function handleChange(e) {
    setInputBid(e.target.value)
  }

  function handleSubmit() {
    if (!inputBid || inputBid <= 0) {
      toastIdRef.current = toast({
        title: "Error",
        description: "[아귀]동작 그만. 밑장빼기냐? ㅡ.ㅡ",
        status: "error",
        duration: 10000,
        isClosable: true,
      })
      // handleClose();

    } else {
      setBidStatus(true)
      makeBid(inputBid)
    }
  }

  function handleClose() {
    setInputBid('');
    onClose();
  }

  const fetchBidDisable = async () => {
    console.log("fetch member info...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/member?address=${address}`)
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      //console.log(res.data);
      if (res.data.status === "success") {
        setBidDisable(false)
      }
    }
  }

  useEffect(() => {
    fetchBidDisable();
  }, [address])

  const designClass = `auction-item bidded-item-${exist}`

  return (
    <div onClick={onOpen} className={designClass}>
      <img src={item.img} className="auction-item-img" alt="item img"/>
      <h1>{item.name}</h1>
      <h2>${item.price}</h2>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent maxW="36.5rem" className="auction-item-box">
          <ModalHeader>
            {auctionDiff <= 0?
              <h3 style={{
                      textAlign: "center", 
                      fontSize:"3vh"
                      }}>
                🎉Congratulations!🎉
              </h3>
              :
              null
            }
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {auctionDiff <= 0?
              <Flex flexDirection="row">
                <img src={item.img} className="contractAddr-img" alt="item img"/>
                <div className="bidding-content">
                  <HStack>
                    <h3>{item.name}</h3>
                    <Tooltip hasArrow label={item.aid} bg="gray.300" color="black">
                      <QuestionOutlineIcon/>
                    </Tooltip>
                  </HStack>
                  <h1>{!highestBid? 0 : highestBid} DOBBY</h1>
                  <Flex>
                    <h5>by</h5>
                    <h5 style={{
                      color: "rgb(243, 114, 114)",
                      marginLeft: "5px",
                      fontWeight: "500"
                      }}>{highestBidder}</h5>
                  </Flex>
                </div>
              </Flex>
              :
              <>
              <Flex flexDirection="row">
                <img src={item.img} className="contractAddr-img" alt="item img"/>
                <div className="bidding-content">
                  <HStack>
                    <h3>{item.name}</h3>
                    <Tooltip hasArrow label={item.aid} bg="gray.300" color="black">
                      <QuestionOutlineIcon/>
                    </Tooltip>
                  </HStack>
                  {auctionDiff <= 1800000?
                    <div style={{
                      color: "transparent",
                      textShadow: "0 0 10px rgb(128,128,128)",
                      userSelect: "none"
                    }}>
                      <h1>{!highestBid? 0 : highestBid} DOBBY</h1>
                      <h5>by {highestBidder}</h5>
                    </div>
                    :
                    <>
                      <h1>{!highestBid? 0 : highestBid} DOBBY</h1>
                      <Flex>
                        <h5>by {highestBidder}</h5>
                        <img 
                          src={highestBidderPic}
                          style={{
                            marginLeft: "10px",
                            width: "25px",
                            height: "25px",
                            objectFit: "cover",
                            borderRadius: "5px"
                          }}
                          alt="highest bidder pic"
                        />
                      </Flex>
                    </>
                  }
                  <br/><br/><hr/>
                  <h5 style={{
                    color:"grey", 
                    fontSize:"1.5vh",
                    marginTop:"2vh"
                    }}>
                    My Bid
                  </h5>
                  <h4 style={{
                    fontSize:"2vh"
                    }}>
                    {myBid} DOBBY
                  </h4>
                </div>
                
              </Flex>
              <Flex flexDirection="row" className="bidding-box" >
                  <InputGroup>
                    <InputLeftAddon children="DOBBY"/>
                    <Input 
                      type="number"
                      value={inputBid}
                      placeholder="Your bid"
                      variant="filled"
                      onChange={handleChange}
                      style={{fontSize: "2vh"}}
                    />
                  </InputGroup>
                  {bidStatus?
                    <Button
                      isLoading
                      colorScheme="red"
                      variant="outline"
                      style={{marginLeft: "1vw", width: "30%"}}
                    ></Button>
                    :
                    <Button 
                      onClick={handleSubmit}
                      rightIcon={<CheckIcon />} 
                      colorScheme="blue" 
                      variant="outline"
                      isDisabled={bidDisable}
                      style={{marginLeft: "1vw", width: "30%"}}
                    >
                      Bid
                    </Button>
                  }
                  
                  </Flex>
                  {bidStatus?
                    <Alert status="warning" style={{marginTop: "2.5vh"}}>
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription display="block">
                          You will see TWO metamask popups
                          <br/>
                          Please follow the instructions on metamask
                          <br/>
                          MUST WAIT UNTIL PAGE AUTOMATICALLY RELOADS!
                        </AlertDescription>
                      </Box>
                      <CloseButton position="absolute" right="8px" top="8px" />
                    </Alert>
                    :
                    null
                  }
                </>
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

