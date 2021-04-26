import {
  Button, 
  Input,
  Stack,
  InputRightAddon,
  InputGroup
} from "@chakra-ui/react";
import './Officer.css';

export default function CreateAuction(
  {auctionName, auctionImg, auctionDuration, 
    handleAuction, handleAuctionChange}
    ) {

  return (
    <Stack spacing={5} className="create-new">
      <h1>Auction</h1>
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
        <InputRightAddon children="DAY(S)" />
      </InputGroup>
      <Button 
        onClick={handleAuction} 
        colorScheme="blue">
        Create Auction
      </Button>
    </Stack>
  )
}