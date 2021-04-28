import React, {useState} from 'react';
import {
  Button, 
  Input,
  Stack,
  InputRightAddon,
  InputGroup,
  Switch,
  FormControl,
  FormLabel,
  useToast
} from "@chakra-ui/react";
import './Officer.css';
import axios from 'axios';

export default function ManageAuction(
  {auctionName, auctionImg, auctionDuration, 
    handleAuction, handleAuctionChange}
    ) {
  const [deleteAuctionId, setDeleteAuctionId] = useState('');

  //design
  const toast = useToast();
  const toastIdRef = React.useRef();

  function handleChange(event) {
    const {value} = event.target;
    setDeleteAuctionId(value);
  }

  function handleDeleteAuction(event) {
    event.preventDefault();
    axios.delete(`https://dobchain-testing.herokuapp.com/auction?auctionId=${deleteAuctionId}`)
      .then(res => {
        console.log(res.data)
        toastIdRef.current = toast({ description: res.data.status })
        setDeleteAuctionId('');
      })
  }

  return (
    <Stack spacing={5} className="create-new">
      <h2>Auction Name:</h2>
      <Input
        name="auctionName" 
        value={auctionName}
        onChange={handleAuctionChange} 
        placeholder="name"
      />
      <Stack spacing={2}>
        <h2>Auction Image:</h2>
        <Input
          name="auctionImg"
          value={auctionImg}
          onChange={handleAuctionChange} 
          placeholder="img link"
        />
      </Stack>
      <h2>Auction Duration:</h2>
      <InputGroup>
        <Input
          name="auctionDuration" 
          type="number"
          value={auctionDuration}
          onChange={handleAuctionChange} 
          placeholder="duration"
        />
        <InputRightAddon children="hour" />
      </InputGroup>
      <Button 
        onClick={handleAuction} 
        colorScheme="green">
        Create Auction
      </Button>

      <h2>Delete Auction</h2>
      <Input
        name="deleteAuctionId"
        value={deleteAuctionId}
        onChange={handleChange} 
        placeholder="auction id"
      />
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="3">
          <h5>Delete All?</h5>
        </FormLabel>
        <Switch id="email-alerts" colorScheme="red" />
      </FormControl>
      <Button onClick={handleDeleteAuction} colorScheme="red">
        Delete Auction
      </Button>
    </Stack>
  )
}