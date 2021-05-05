import './Officer.css';
import kseaToken from '../ethereum/KSEA_Token';
import kseAirdrop from '../ethereum/KSEAirdrop';
import auctionFactory from '../ethereum/AuctionFactory';
import React, { useEffect, useState} from 'react';

import axios from 'axios';
import {
  Button, Input, Stack, Flex,
  useToast,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Alert, AlertIcon, AlertTitle, AlertDescription,
  Box,
  CloseButton
} from "@chakra-ui/react";

//Import officer components
import ManageAuction from './ManageAuction';
import ManageCheckin from './ManageCheckin';
import ManageMember from './ManageMember';

import Notify from 'bnc-notify';

const notify = Notify({
  dappId: 'a26b3ed4-031c-40da-bbf7-cf3f1f0ee190',
  networkId: 4
});

export default function Officer({address}) {
  //design
  const toast = useToast()
  const toastIdRef = React.useRef()

  // Event id
  const [eventId, setEventId] = useState('');
  const [eventPoint, setEventPoint] = useState(0);

  // New auction item info
  const [auctionImg, setAuctionImg] = useState('');
  const [auctionName, setAuctionName] = useState('');
  const [auctionPrice, setAuctionPrice] = useState('');

  // blockchain related
  const [airdrop, setAirdrop] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [factory, setFactory] = useState(undefined);
  const [boardValue, setBoardValue] = useState('');
  const [isBoard, setIsBoard] = useState(false);
  const [createStatus, setCreateStatus] = useState(false);
 
  // distribute token/ether
  const [inputToken, setInputToken] = useState('');
  const [inputEther, setInputEther] = useState('');
  const [distDobbyStatus, setDistDobbyStatus] = useState(false);
  const [distEtherStatus, setDistEtherStatus] = useState(false);

  //list of members
  const [listOfMembers, setListOfMembers] = useState([]);
  const [listOfMembersNames, setListOfMembersNames] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let t = await kseaToken()
      setToken(t);

      let a = await kseAirdrop()
      setAirdrop(a);

      let f = await auctionFactory()
      setFactory(f);
    }
    fetchData();
  }, []);


  //KSEAirdrop button handlers. These functions will get called when buttons are clicked
  function handleBoardChange(event) {
    setBoardValue(event.target.value);
  }

  function handleRegister(event) {
    event.preventDefault();
    registerBoardMem(boardValue)
    console.log("register Board Member works!")
  }

  function handleDeregister(event) {
    event.preventDefault();
    deregisterBoardMem(boardValue)
  }


  //KSEAirdrop Smart contract function calls. These functions will interact with the deployed smart contracts.
  async function registerBoardMem(_address) {
    await airdrop.methods.registerBoardMember(_address).send({from:address})
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
    });
    let board = await airdrop.methods.isBoardMember(_address).call();
    console.log("IsBoardMember: ", board);
  }

  async function deregisterBoardMem(_address) {
    await airdrop.methods.deregisterBoardMember(_address).send({from:address})
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
    });
    let board = await airdrop.methods.isBoardMember(_address).call();
    console.log("IsBoardMember: ", board);
  }


  // Distribute Token
  const fetchCheckedinMembers = async () => {
    console.log("fetching checked in members...")
    await axios.get(`https://dobchain-testing.herokuapp.com/checkedinMembers?eventId=${eventId}`)
      .then(res => {
        console.log(res.data)
        setListOfMembers(res.data.addresses)
        setListOfMembersNames(res.data.names)
        fetchEventPoints();
      })
      .catch(err => {
        console.log("Error:", err)
      })
  }

  const fetchEventPoints = async () => {
    console.log("fetching points for the event...")
    axios.get(`https://dobchain-testing.herokuapp.com/event?eventId=${eventId}`)
      .then(res => {
        console.log(res.data)
        const dataStatus = res.data.status
        if (dataStatus === "success") {
          setEventPoint(res.data.eventInfo.pointAmount)
        } else {
          toastIdRef.current = toast({
            title: "Error",
            description: res.data.statusDes,
            status: "error",
            duration: 10000,
            isClosable: true,
          })
        }
      })
      .catch(err => {
        console.log("Error:", err)
      })
  }

  function handleDistributeToken(event) {
    event.preventDefault();
    setDistDobbyStatus(true);
    if (listOfMembers.length < 1) {
      toastIdRef.current = toast({ description: `Must view members`})
      return;
    }
    distributeDobbyTokens(listOfMembers, inputToken);
  }

  async function distributeDobbyTokens(_addresses, _value) {
    let total_val = _value * _addresses.length
    await token.methods.approve(airdrop._address, total_val).send({from:address})
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
      setDistDobbyStatus(false);
    });
    await airdrop.methods.distributeDobbyTokens(_addresses, _value).send({from:address})
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
      setDistDobbyStatus(false);
    });
    //console.log(total_val)
    setEventId('')
    setInputToken('')
    setDistDobbyStatus(false);
    window.location.reload();
  }

  function handleDistributeChange(event) {
    const {name, value} = event.target
    if (name === "inputToken") {
      setInputToken(value)
    } else if (name === "eventId") {
      setEventId(value)
    } else {
      setInputEther(value)
    }
  }

  function handleViewCheckedinMembers() {
    fetchCheckedinMembers();
  }

  const viewListofMembers = listOfMembersNames.map(member=> {
    return (
      <p key={member}>{member}</p>
    )
  })

  //Distribute Ether
  
  async function distributeEther(_addresses, _value) {
    let _ether = _value * 1e18
    let total_val = _ether * _addresses.length
    await airdrop.methods.distributeEther(_addresses).send({from:address, value:total_val})
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
      setDistEtherStatus(false);
    });
    setInputEther('');
    setDistEtherStatus(false);
    window.location.reload();
    //console.log(total_val)
  }

  const distributeEtherToMembers = async () => {
    console.log("fetching all members...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/members`)
      .catch(err => {
        console.log("Error:", err)
      })
    
    if(res) {
      console.log(res.data)
      const wholeList = res.data
      const listofAllMembers = wholeList.map(eachMember => eachMember.address)
      distributeEther(listofAllMembers, inputEther);
    }
  }

  function handleDistributeEther(event) {
    event.preventDefault();
    setDistEtherStatus(true);
    distributeEtherToMembers();
  }


  //Auction
  /** 
   * 1. create auction 
   * 2. put into a list of auction addresses
   */
  function handleAuctionChange(event) {
    event.preventDefault();
    const { name, value } = event.target
    if (name === "auctionName") {
      setAuctionName(value);
    } else if (name === "auctionImg") {
      setAuctionImg(value)
    }  else if (name === "auctionPrice") {
      setAuctionPrice(value)
    }
  }

  async function handleAuction(event) {
    event.preventDefault();
    setCreateStatus(true)
    await createAuction(auctionName, "0x692B98Fa3971Eed67d66DFB41B662667627A310a");
  }

  async function createAuction(name, tokenAddr) {
    await factory.methods.createAuction(name, tokenAddr).send({from:address})
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
      setCreateStatus(false);
    });
    await factory.methods.getAuctionAddr(name).call().then(auctionAddr => {
      let formData = new FormData();
      formData.append('name', auctionName); 
      formData.append('img', auctionImg); 
      formData.append('contractAddr', auctionAddr); 
      formData.append('price', auctionPrice); 
      axios.post(`https://dobchain-testing.herokuapp.com/auction`, formData)
        .then(res => { 
          console.log(res.data.status)
          toastIdRef.current = toast({ description: `Auction ${name} created`})
          setAuctionImg('');
          setAuctionName('');
          setAuctionPrice('');
          setCreateStatus(false);
        })
    });
  }

  async function fetchBoardStatus(_address) {
    if (airdrop && _address) {
      let board = await airdrop.methods.isBoardMember(_address).call();
      console.log("I am board member:" , board)
      setIsBoard(board)
    }
  }

  useEffect(() => {
    fetchBoardStatus(address);
  }, [address, airdrop]);

  return airdrop && token? (
    <Flex flexDirection="column" alignItems="center" id='officer'>
    {isBoard? 
      null
      : 
      <h1>You are not a registered board member</h1>
    }
    <Tabs isFitted variant="enclosed" style={{width: "70%"}}>
      <TabList>
        <Tab><h3>Officer Management</h3></Tab>
        <Tab><h3>Distribute Dobby</h3></Tab>
        <Tab><h3>Distribute Ether</h3></Tab>
        <Tab><h3>Auction</h3></Tab>
        <Tab><h3>Checkin Event</h3></Tab>
        <Tab><h3>Member Management</h3></Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Stack spacing={5} className="create-new">
            <h4>Register</h4>
            <Input 
              onChange={handleBoardChange} 
              placeholder="officer metamask address"
            />
            <Button onClick={handleRegister} isDisabled={!isBoard} colorScheme="green">
              Register Officer
            </Button>

            <h4>Deregister</h4>
            <Input 
              onChange={handleBoardChange} 
              placeholder="officer metamask address"
            />
            <Button onClick={handleDeregister} isDisabled={!isBoard} colorScheme="red">
              Deregister Officer
            </Button>
          </Stack>
        </TabPanel>

        <TabPanel>
          <Stack spacing={5} className="create-new">
              <Input
                name="eventId"
                type="number"
                value={eventId}
                onChange={handleDistributeChange} 
                placeholder="event Id"
              />
              <Button onClick={handleViewCheckedinMembers} isDisabled={!isBoard} colorScheme="green">
                View Event Details
              </Button>
              <p># Dobbies to distribute: {eventPoint * 10}</p>
              {viewListofMembers.length > 0?
                <div>List of members: {viewListofMembers}</div>
                :
                <div>List of members: none</div>
              }
              <Input
                name="inputToken"
                type="number"
                value={inputToken}
                onChange={handleDistributeChange} 
                placeholder="token amount"
              />
              {distDobbyStatus?
                <Stack spacing={3}>
                  <Button
                    isLoading
                    loadingText="Dobby Distribution in process"
                    colorScheme="red"
                    variant="outline"
                  ></Button>
                  <Alert status="error">
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
                </Stack>
                :
                <Button 
                  onClick={handleDistributeToken}
                  colorScheme="blue"
                  isDisabled={!isBoard}
                >
                  Distribute Dobby
                </Button>
              }
            </Stack>
        </TabPanel>

        <TabPanel>
          <Stack spacing={5} className="create-new">
            <Input
              name="inputEther"
              type="number"
              value={inputEther}
              onChange={handleDistributeChange} 
              placeholder="Ether amount"
            />
            {distEtherStatus?
              <Stack spacing={3}>
                <Button
                  isLoading
                  loadingText="Ether Distribution in process"
                  colorScheme="red"
                  variant="outline"
                ></Button>
                <Alert status="error">
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>Warning!</AlertTitle>
                    <AlertDescription display="block">
                      You will see one metamask popup
                      <br/>
                      Please follow the instructions on metamask
                      <br/>
                      MUST WAIT UNTIL PAGE AUTOMATICALLY RELOADS!
                    </AlertDescription>
                  </Box>
                  <CloseButton position="absolute" right="8px" top="8px" />
                </Alert>
              </Stack>
              :
              <Button 
                onClick={handleDistributeEther}
                colorScheme="blue"
                isDisabled={!isBoard}
              >
                Distribute Ether
              </Button>
            }
          </Stack>
        </TabPanel>

        <TabPanel>
          <ManageAuction
            auctionName = {auctionName}
            auctionImg = {auctionImg}
            auctionPrice = {auctionPrice}
            handleAuction = {handleAuction}
            handleAuctionChange = {handleAuctionChange}
            isBoard={isBoard}
            createStatus={createStatus}
          />
        </TabPanel>

        <TabPanel>
          <ManageCheckin isBoard={isBoard}/>
        </TabPanel>

        <TabPanel>
          <ManageMember isBoard={isBoard}/>
        </TabPanel>
        
      </TabPanels>
    </Tabs>
  </Flex>
  ) : (
    <div>Loading...</div>
  )
}
