import React, { useState} from 'react';
import {
  Button, 
  Input,
  Stack,
  InputRightAddon,
  InputGroup,
  Textarea,
  useToast
} from "@chakra-ui/react";
import './Officer.css';
import axios from 'axios';

export default function CreateCheckin() {
  //design
  const toast = useToast();
  const toastIdRef = React.useRef();

  // New checkin event info
  const [name, setName] = useState('');
  const [timelimit, setTimelimit] = useState('');
  const [password, setPassword] = useState('');
  const [detail, setDetail] = useState('');
  const [eventPoint, setEventPoint] = useState('');

  
  // Manage checkins
  function handleSubmit(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append('eventName', name); 
    formData.append('timeLimit', timelimit);
    formData.append('password', password);
    formData.append('eventPoint', eventPoint);
    formData.append('eventDetails', detail);
    axios.post(`https://dobchain-testing.herokuapp.com/createcheckin`, formData)
      .then(res => {
        if (res.data.status === "success") {
          toastIdRef.current = toast({ description: `${name} created` })
          setName('');
          setTimelimit('');
          setPassword('');
          setDetail('');
          setEventPoint('');
        }
      })
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
    } else {
      setEventPoint(value);
    }
  }
      
  return (
    <Stack spacing={5} className="create-new">
      <h1>Checkin Event</h1>
      <h2>Event Name:</h2>
      <Input
        value={name}
        onChange={handleChange} 
        name="name" 
        placeholder="name"
      />
      <h2>Event Password:</h2>
      <Input
        value={password}
        onChange={handleChange} 
        name="password" 
        placeholder="password"
      />
      <h2>Event Points:</h2>
      <InputGroup>
        <Input
          type="number"
          value={eventPoint}
          onChange={handleChange} 
          name="eventPoint"
          placeholder="points"
        />
        <InputRightAddon children="points" />
      </InputGroup>
      <h2>Event Details:</h2>
      <Textarea
        name="detail"
        value={detail}
        onChange={handleChange}
        placeholder="details"
      />
      <h2>Event Time Limit:</h2>
      <InputGroup>
        <Input
          type="number"
          value={timelimit}
          onChange={handleChange} 
          name="timelimit" 
          placeholder="time limit"
        />
        <InputRightAddon children="min" />
      </InputGroup>
      <Button 
        onClick={handleSubmit} 
        colorScheme="green">
        Create Event
      </Button>
    </Stack>
  )
}