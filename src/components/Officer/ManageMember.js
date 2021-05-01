import React, { useState} from 'react';
import {
  Button, 
  Input,
  Stack,
  useToast
} from "@chakra-ui/react";
import './Officer.css';
import axios from 'axios';

export default function ManageMember({isBoard}) {
  //design
  const toast = useToast();
  const toastIdRef = React.useRef();

  //Member info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [img, setImg] = useState('');
  const [numPoints, setNumPoints] = useState('');
  const [address, setAddress] = useState('');
  const [deleteMemAddr, setDeleteMemAddr] = useState('');

  
  // Manage checkins
  function handleAddMember(event) {
    event.preventDefault();
    axios.post(`https://dobchain-testing.herokuapp.com/member`, 
      {
        "name": name,
        "img": img,
        "num_points": numPoints,
        "email": email,
        "address": address
      }
    ).then(res => {
      console.log(res.data);
      const dataStatus = res.data.status;
      toastIdRef.current = toast({
        title: dataStatus.charAt(0).toUpperCase() + dataStatus.slice(1),
        description: res.data.statusDes,
        status: dataStatus,
        duration: 9000,
        isClosable: true,
      })
      setName('');
      setEmail('');
      setImg('');
      setNumPoints('');
      setAddress('');
    })
  }

  function handleDeleteMember(event) {
    event.preventDefault();
    axios.delete(`https://dobchain-testing.herokuapp.com/member?address=${deleteMemAddr}`)
    .then(res => {
      console.log(res.data);
      const dataStatus = res.data.status;
      toastIdRef.current = toast({
        title: dataStatus.charAt(0).toUpperCase() + dataStatus.slice(1),
        description: res.data.statusDes,
        status: dataStatus,
        duration: 9000,
        isClosable: true,
      })
      setDeleteMemAddr('');
    })
  }

  function handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target
     if (name === "name") {
      setName(value);
    } else if (name === "img") {
      setImg(value)
    } else if (name === "email") {
      //https://source.unsplash.com/random
      setEmail(value)
    } else if (name === "numPoints") {
      setNumPoints(value)
    } else if (name === "address") {
      setAddress(value)
    } else {
      setDeleteMemAddr(value)
    }
  }
      
  return (
    <Stack spacing={5} className="create-new">
      <h4>Add New Member</h4>
      <Input
        name="name"
        value={name}
        onChange={handleChange} 
        placeholder="name"
      />
      <Input
        name="email"
        value={email}
        onChange={handleChange} 
        placeholder="email address"
      />
      <Input
        name="img"
        value={img}
        onChange={handleChange} 
        placeholder="img link"
      />
      <Input
        name="numPoints"
        value={numPoints}
        onChange={handleChange} 
        placeholder="current number of points"
      />
      <Input
        name="address"
        value={address}
        onChange={handleChange} 
        placeholder="metamask address"
      />
      <Button onClick={handleAddMember} isDisabled={!isBoard} colorScheme="green">
        Add Member
      </Button>
      <h4>Delete Member</h4>
      <Input
        name="deleteMemAddr"
        value={deleteMemAddr}
        onChange={handleChange} 
        placeholder="metamask address"
      />
      <Button onClick={handleDeleteMember} isDisabled={!isBoard} colorScheme="red">
        Delete Member
      </Button>
    </Stack>
  )
}