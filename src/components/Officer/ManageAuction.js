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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Kbd
} from "@chakra-ui/react";
import { WarningTwoIcon } from '@chakra-ui/icons';
import './Officer.css';
import axios from 'axios';

export default function ManageAuction(
  {auctionName, auctionImg, auctionDuration, 
    handleAuction, handleAuctionChange, isBoard}
    ) {
  const [deleteAuctionId, setDeleteAuctionId] = useState('');
  const [deleteAll, setDeleteAll] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState('');

  //design
  const toast = useToast();
  const toastIdRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleChange(event) {
    const {name, value} = event.target;
    if (name === "deleteAuctionId") {
      setDeleteAuctionId(value);
    } else if (name === "deleteAll") {
      setDeleteAll(val => !val);
    }  else if (name === "deleteAllConfirm") {
      setDeleteAllConfirm(value);
    }
    //console.log(deleteAll)
  }

  function handleDeleteAuction(event) {
    event.preventDefault();
    if (deleteAll) {
      onOpen();
    } else {
      axios.delete(`https://dobchain-testing.herokuapp.com/auction?auctionId=${deleteAuctionId}`)
        .then(res => {
          console.log(res.data)
          const dataStatus = res.data.status;
          toastIdRef.current = toast({
            title: dataStatus.charAt(0).toUpperCase() + dataStatus.slice(1),
            description: res.data.statusDes,
            status: dataStatus,
            duration: 9000,
            isClosable: true,
          })
          setDeleteAuctionId('');
        })
    }
  }

    function handleDeleteAllAuctions(event) {
    event.preventDefault();
    //console.log(deleteAllConfirm)
    if (deleteAllConfirm !== "Delete all auctions") {
      toastIdRef.current = toast({
          title: "Error",
          description: "Incorrect confirmation",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      handleClose();
      return;
    }
    //delete all events
    axios.delete(`https://dobchain-testing.herokuapp.com/auctions`)
      .then(res => {
        console.log(res.data)
        toastIdRef.current = toast({
          title: "Success",
          description: res.data.status,
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        handleDeleteAllAuctionBids();
      })
    
  }

  function handleDeleteAllAuctionBids() {
    //delete all checkins
    axios.delete(`https://dobchain-testing.herokuapp.com/auctionbids`)
      .then(res => {
        console.log(res.data)
        toastIdRef.current = toast({
          title: "Success",
          description: res.data.status,
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        handleClose();
      })
  }

  function handleClose() {
    setDeleteAll(false);
    setDeleteAllConfirm('');
    onClose();
  }

  return (
    <Stack spacing={5} className="create-new">
      <h3>Create auction</h3>
      <Input
        name="auctionName" 
        value={auctionName}
        onChange={handleAuctionChange} 
        placeholder="auction name"
      />
      <Stack spacing={2}>
        <Input
          name="auctionImg"
          value={auctionImg}
          onChange={handleAuctionChange} 
          placeholder="auction img link"
        />
      </Stack>
      <InputGroup>
        <Input
          name="auctionDuration" 
          type="number"
          value={auctionDuration}
          onChange={handleAuctionChange} 
          placeholder="auction duration"
        />
        <InputRightAddon children="hour" color="black" />
      </InputGroup>
      <Button 
        onClick={handleAuction} 
        isDisabled={!isBoard} 
        colorScheme="green"
      >
        Create Auction
      </Button>

      <h3>Delete Auction</h3>
      <Input
        type="number"
        name="deleteAuctionId"
        value={deleteAuctionId}
        onChange={handleChange} 
        placeholder="auction id"
      />
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="delete-alerts" mb="3">
          <h5>Delete All?</h5>
        </FormLabel>
        <Switch 
          id="delete-alerts" 
          colorScheme="red"
          name="deleteAll"
          onChange={handleChange}
          defaultChecked={false}
          isChecked={deleteAll}
        />
      </FormControl>
      <Button onClick={handleDeleteAuction} isDisabled={!isBoard} colorScheme="red">
        Delete Auction
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>DELETING ALL AUCTIONS <WarningTwoIcon/> </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="10px">
              <p>Are you sure?</p>
              <p>This action cannot be undone. 
              This will permanently delete all auction database and bids made to each item.</p>
              <p>Please type 
              <span>
                <Kbd color="black">Delete all auctions</Kbd>
              </span>
              to confirm.</p>
              <Input 
                name="deleteAllConfirm"
                value={deleteAllConfirm}
                onChange={handleChange}
                size="sm"
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleDeleteAllAuctions} colorScheme="red">
              I understand the consequence, delete all
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}