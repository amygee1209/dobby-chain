import React, { useState } from 'react';
import {
  Button, Input, Stack,
  InputRightAddon,
  InputGroup,
  Textarea,
  useToast,
  FormControl,
  FormLabel,
  Switch,
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

export default function ManageCheckin() {
  //design
  const toast = useToast();
  const toastIdRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // New checkin event info
  const [name, setName] = useState('');
  const [timelimit, setTimelimit] = useState('');
  const [password, setPassword] = useState('');
  const [detail, setDetail] = useState('');
  const [eventPoint, setEventPoint] = useState('');
  const [deleteEventId, setDeleteEventId] = useState('');
  const [deleteAll, setDeleteAll] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState('');

  // Manage checkins
  function handleSubmit(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append('eventName', name); 
    formData.append('timeLimit', timelimit);
    formData.append('password', password);
    formData.append('eventPoint', eventPoint);
    formData.append('eventDetails', detail);
    axios.post(`https://dobchain-testing.herokuapp.com/event`, formData)
      .then(res => {
        console.log(res.data)
        toastIdRef.current = toast({
          title: "Success",
          description: res.data.status,
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        setName('');
        setTimelimit('');
        setPassword('');
        setDetail('');
        setEventPoint('');
      })
  }

  function handleDeleteEvent(event) {
    event.preventDefault();
    if (deleteAll) {
      onOpen();
    } else {
      axios.delete(`https://dobchain-testing.herokuapp.com/event?eventId=${deleteEventId}`)
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
          setDeleteEventId('');
        })
    }
  }

  function handleDeleteAllEvents(event) {
    event.preventDefault();
    //console.log(deleteAllConfirm)
    if (deleteAllConfirm !== "Delete all events") {
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
    axios.delete(`https://dobchain-testing.herokuapp.com/events`)
      .then(res => {
        console.log(res.data)
        toastIdRef.current = toast({
          title: "Success",
          description: res.data.status,
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        handleDeleteAllCheckins();
      })
  }

  function handleDeleteAllCheckins() {
    //delete all checkins
    axios.delete(`https://dobchain-testing.herokuapp.com/checkins`)
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

  function handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target
    if (name === "name") {
      setName(value);
    } else if (name === "timelimit") {
      setTimelimit(value)
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "detail") {
      setDetail(value);
    } else if (name === "eventPoint") {
      setEventPoint(value);
    } else if (name === "deleteEventId") {
      setDeleteEventId(value);
    } else if (name === "deleteAll") {
      setDeleteAll(val => !val);
    } else if (name === "deleteAllConfirm") {
      setDeleteAllConfirm(value);
    }
  }
      
  return (
    <Stack spacing={5} className="create-new">
      <h3>Add New Event</h3>
      <Input
        value={name}
        onChange={handleChange} 
        name="name" 
        placeholder="event name"
      />
      <Input
        value={password}
        onChange={handleChange} 
        name="password" 
        placeholder="event password"
      />
      <InputGroup>
        <Input
          type="number"
          value={eventPoint}
          onChange={handleChange} 
          name="eventPoint"
          placeholder="event points"
        />
        <InputRightAddon children="points"  color="black" />
      </InputGroup>
      <Textarea
        name="detail"
        value={detail}
        onChange={handleChange}
        placeholder="event details"
      />
      <InputGroup>
        <Input
          type="number"
          value={timelimit}
          onChange={handleChange} 
          name="timelimit" 
          placeholder="event time limit"
        />
        <InputRightAddon children="min"  color="black" />
      </InputGroup>
      <Button 
        onClick={handleSubmit} 
        colorScheme="green">
        Create Event
      </Button>

      <h3>Delete Event</h3>
      <Input
        name="deleteEventId"
        value={deleteEventId}
        onChange={handleChange} 
        placeholder="event id"
      />
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="3">
          <h5>Delete All?</h5>
        </FormLabel>
        <Switch 
          id="email-alerts" 
          colorScheme="red" 
          name="deleteAll"
          onChange={handleChange}
          defaultChecked={false}
          isChecked={deleteAll}
        />
      </FormControl>
      <Button onClick={handleDeleteEvent} colorScheme="red">
        Delete Event
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>DELETING ALL EVENTS <WarningTwoIcon/> </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="10px">
              <p>Are you sure?</p>
              <p>This action cannot be undone. 
              This will permanently delete all event and checkin database.</p>
              <p>Please type 
              <span>
                <Kbd color="black">Delete all events</Kbd>
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
            <Button onClick={handleDeleteAllEvents} colorScheme="red">
              I understand the consequence, delete all
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}