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
  Alert,
  AlertIcon,
  Flex
} from "@chakra-ui/react"
import { CheckIcon } from '@chakra-ui/icons'
import './AuctionItem.css';
import axios from 'axios';

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
      console.log(highest[0], highest[1], highest[2])
      let highestForm = new FormData();
      highestForm.append('aid', item.aid); 
      highestForm.append('highestBid', highest[0]); 
      highestForm.append('highestBidder', highest[1]);
      axios.put(`https://dobchain-testing.herokuapp.com/auction`, highestForm)
        .then(res => {
          console.log(res.data.highestBidder)
          updateMyBid(highest[2]);
        })
      });
      console.log("my bid: ", myBid);
      return true;
  }
    
  function updateMyBid(updatedMyBid) {
    console.log("My updated bid:", updatedMyBid)
    let inputBidForm = new FormData();
    inputBidForm.append('aid', item.aid); 
    inputBidForm.append('inputBid', updatedMyBid);
    inputBidForm.append('address', address);
    axios.post(`https://dobchain-testing.herokuapp.com/auctionbid`, inputBidForm)
      .then(res => {
        console.log(res.data.statusDes)
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
        description: "너같으면 그게 배팅이 되겠냐? ㅡ.ㅡ",
        status: "error",
        duration: 10000,
        isClosable: true,
      })
      handleClose();

    } else {
      setBidStatus(true)
      makeBid(inputBid)
      .then(status => {
        console.log(status)
        if (status) {
          toastIdRef.current = toast({
            title: "Success",
            description: "짝짝짝! 성공적으로 배팅하셨습니다!",
            status: "success",
            duration: 10000,
            isClosable: true,
          })
          setBidStatus(false);
          handleClose();
          //auto reload
          window.location.reload();
        }
      })
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
      } else {
        toastIdRef.current = toast({
          title: "Error",
          description: res.data.status,
          status: "error",
          duration: 100000,
          isClosable: true,
        })
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

      <Modal closeOnOverlayClick={false} size="xl" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent className="auction-item-box">
          <ModalHeader>{item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {auctionDiff <= 0?
              <div>
                <img src={item.img} className="contractAddr-img" alt="item img"/>
                <h1>Congratulations!!!!!</h1>
                <h1>{highestBidder}</h1>
              </div>
              :
              <Stack spacing="2vh">
                <img src={item.img} className="contractAddr-img" alt="item img"/>
                <h2>Auction Address:</h2>
                <h2>{item.contractAddr}</h2>
                <h2>Auction Id: {item.aid}</h2>
                {auctionDiff <= 1800000?
                  <>
                    <h2>Highest Bid: 궁금하쥬?</h2>
                    <h2>Highest Bidder: 궁금하쥬?</h2>
                  </>
                  :
                  <>
                    <h2>Highest Bid: {highestBid} token(s)</h2>
                    <h2>Highest Bidder: {highestBidder} </h2>
                  </>
                }
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
                    <Stack spacing={3}>
                      <Button
                        isLoading
                        loadingText="Bidding in process"
                        colorScheme="red"
                        variant="outline"
                      ></Button>
                      <Alert status="error">
                        <AlertIcon />
                        INTERACTING WITH BLOCKCHAIN TAKES TIME
                        <br/>
                        PLEASE DO NOT TOUCH ANYTHING
                      </Alert>
                    </Stack>
                    :
                    <Flex justifyContent="center">
                      <Button 
                        onClick={handleSubmit}
                        rightIcon={<CheckIcon />} 
                        colorScheme="blue" 
                        variant="outline"
                        className="btn"
                        isDisabled={bidDisable}
                      >
                        Bid
                      </Button>
                    </Flex>
                  }
              </Stack>
            }
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

