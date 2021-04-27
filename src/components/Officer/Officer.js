import './Officer.css';
import kseaToken from '../ethereum/KSEA_Token';
import kseAirdrop from '../ethereum/KSEAirdrop';
import auctionFactory from '../ethereum/AuctionFactory';
import React, { useEffect, useState} from 'react';

//redux imports
import { useDispatch, useSelector } from 'react-redux';
import { setAuctionList } from '../../redux/actions/userActions';

import axios from 'axios';
import {
  Button, 
  Input,
  Stack,
  useToast
} from "@chakra-ui/react"

//Import officer components
import CreateAuction from './CreateAuction';
import CreateCheckin from './CreateCheckin';
import ManageMember from './ManageMember';

export default function Officer({address, onboardState}) {
  //design
  const toast = useToast()
  const toastIdRef = React.useRef()

  const dispatch = useDispatch()
  const user = useSelector((state) => state.allUsers.selUser)

  // Event id
  const [eventId, setEventId] = useState('');

  // New auction item info
  const [auctionImg, setAuctionImg] = useState('');
  const [auctionName, setAuctionName] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('');

  // blockchain related
  const [airdrop, setAirdrop] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [factory, setFactory] = useState(undefined);
  const [boardValue, setBoardValue] = useState('');
  const [listOfAuctions, setListOfAuctions] = useState([]);

  //input token/ether
  const [inputToken, setInputToken] = useState('');
  const [inputEther, setInputEther] = useState('');

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

  useEffect(() => {
    let list = JSON.parse(localStorage.getItem('listOfAuction', listOfAuctions));  
    setListOfAuctions(list); 
  }, [])

  useEffect(() => {
    console.log("list of auctions: " + listOfAuctions);
    localStorage.setItem('listOfAuction', JSON.stringify(listOfAuctions));   
    dispatch(setAuctionList(listOfAuctions))
  }, [listOfAuctions])


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
    let board = await airdrop.methods.isBoardMember(_address).call();
    console.log("IsBoardMember: ", board);
  }

  async function deregisterBoardMem(_address) {
    await airdrop.methods.deregisterBoardMember(_address).send({from:address})
    let board = await airdrop.methods.isBoardMember(_address).call();
    console.log("IsBoardMember: ", board);
  }


  // Distribute Token
  const fetchCheckedinMembers = async () => {
    console.log("fetching checked in members...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/checkedinMembers?eventId=${eventId}`)
      .catch(err => {
        console.log("Error:", err)
      })
    
    if(res) {
      console.log(res.data)
      setListOfMembers(res.data.addresses)
      setListOfMembersNames(res.data.names)
    }
  }

  function handleDistributeToken(event) {
    event.preventDefault();
    if (listOfMembers.length < 1) {
      toastIdRef.current = toast({ description: `Must view members`})
      return;
    }
    distributeDobbyTokens(listOfMembers, inputToken);
  }

  async function distributeDobbyTokens(_addresses, _value) {
    let total_val = _value * _addresses.length
    await token.methods.approve(airdrop._address, total_val).send({from:address});
    await airdrop.methods.distributeDobbyTokens(_addresses, _value).send({from:address})
    //console.log(total_val)
    setEventId('')
    setInputToken('')
  }

  function handleDistributeChange(event) {
    const {name, value} = event.target
    if (name === "inputToken") {
      setInputToken(value)
    } else if (name == "eventId") {
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
    setInputEther('')
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
    } else {
      setAuctionDuration(value);
    }
  }

  async function handleAuction(event) {
    event.preventDefault();
    await createAuction(auctionName, "0x692B98Fa3971Eed67d66DFB41B662667627A310a")
    // console.log(listOfAuctions);
  }

  async function createAuction(name, tokenAddr) {
    await factory.methods.createAuction(name, tokenAddr).send({from:address});
    await factory.methods.getAuctionAddr(name).call().then(auctionAddr => {
      let formData = new FormData();
      formData.append('name', auctionName); 
      formData.append('img', auctionImg); 
      formData.append('contractAddr', auctionAddr); 
      formData.append('duration', auctionDuration); 
      axios.post(`https://dobchain-testing.herokuapp.com/auction`, formData)
        .then(res => { 
          console.log(res.data.status)
          toastIdRef.current = toast({ description: `Auction ${name} created`})
          setAuctionImg('');
          setAuctionName('');
          setAuctionDuration('');
        })
    });
  }

  return airdrop && token? (
    <div>
      {!onboardState.address ?
        <h2>Please Connect Your Wallet</h2>
        :
        <div>
          {/* {bool ? */}
            <Stack spacing={10} id='officer'>
              <Stack spacing={5} className="create-new">
                <h1>Officer Management</h1>
                <div>
                  <Input onChange={handleBoardChange} placeholder="medium size" size="md" />
                  <Button onClick={handleRegister} colorScheme="blue">Register Officer</Button>
                </div>

                <div>
                  <Input onChange={handleBoardChange} placeholder="medium size" size="md" />
                  <Button onClick={handleDeregister} colorScheme="blue">
                    Deregister Officer</Button>
                </div>
              </Stack>

              <Stack spacing={5} className="create-new">
                <h1>Distribute Dobby</h1>
                <Input
                  name="eventId"
                  type="number"
                  value={eventId}
                  onChange={handleDistributeChange} 
                  placeholder="event Id"
                />
                <Button onClick={handleViewCheckedinMembers} colorScheme="blue">View members</Button>
                <div>List of members: {viewListofMembers}</div>
                <Input
                  name="inputToken"
                  type="number"
                  value={inputToken}
                  onChange={handleDistributeChange} 
                  placeholder="token amount"
                />
                <Button onClick={handleDistributeToken} colorScheme="blue">Distribute Dobby</Button>
              </Stack>

              <Stack spacing={5} className="create-new">
                <h1>Distribute Ether</h1>
                <Input
                  name="inputEther"
                  type="number"
                  value={inputEther}
                  onChange={handleDistributeChange} 
                  placeholder="Ether amount"
                />
                <Button onClick={handleDistributeEther} colorScheme="blue">Distribute Ether</Button>
              </Stack>

              <CreateAuction
                auctionName = {auctionName}
                auctionImg = {auctionImg}
                auctionDuration = {auctionDuration}
                handleAuction = {handleAuction}
                handleAuctionChange = {handleAuctionChange}
              />

              <CreateCheckin />

              <ManageMember />

            </Stack>
          {/* //   :
          //   <div>You Are Not An Officer</div>
          // } */}

        </div>
      }
    </div>
  ) : (
    <div>Loading...</div>
  )
}
