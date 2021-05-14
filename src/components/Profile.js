import React, {useState, useEffect} from 'react';
import './Profile.css';
import {
  Input,
  Stack,
  useToast,
  CircularProgress,
  ButtonGroup,
  IconButton,
  Flex
} from "@chakra-ui/react";
import { 
  CloseIcon, 
  CheckIcon, 
  EditIcon
} from '@chakra-ui/icons';
import axios from 'axios';
import defaultImg from './../img/default.jpg';

export default function Profile({address}) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  //design
  const toast = useToast();
  const toastIdRef = React.useRef();

  const fetchUser = async () => {
    console.log("fetch member info...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/member?address=${address}`)
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      //console.log(res.data);
      setUser(res.data.memberInfo)
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [address])

  const updateUserInfo = async () => {
    console.log("update member info...")
    let newName = name
    let newEmail = email
    if (name === '') newName = user.name
    if (email === '') newEmail = user.email
    let formData = new FormData();
    formData.append('address', address); 
    formData.append('name', newName); 
    formData.append('email', newEmail);
    const res = await axios
      .put(`https://dobchain-testing.herokuapp.com/member`, formData)
      .catch(err => {
        console.log("Error:", err)
      })
    
    if(res) {
      //console.log(res.data)
      const dataStatus = res.data.status;
      toastIdRef.current = toast({
        title: dataStatus.charAt(0).toUpperCase() + dataStatus.slice(1),
        description: res.data.statusDes,
        status: dataStatus,
        duration: 10000,
        isClosable: true,
      })
      handleReset();
      setEdit(false);
      window.location.reload();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateUserInfo();
  }

  function handleChange(e) {
    const {name, value} = e.target
    if (name === "name") {
      setName(value)
    } else {
      setEmail(value)
    }
  }
  
  function handleReset() {
    setName('');
    setEmail('');
  }

  return (
    <>
      {loading?
        <CircularProgress isIndeterminate color="blue.300" />
        :
        <div id="profile">
          {user.img?
            <img src={user.img} alt="default headshot"/>
            :
            <img src={defaultImg} alt="headshot"/>
          }
          <div className="info">
            {edit ?
              <Stack spacing={5}>
                <Input 
                  type="text"
                  name="name"
                  value={name}
                  placeholder={user.name}
                  onChange={handleChange}
                />
                <Input 
                  type="text"
                  name="email"
                  value={email}
                  placeholder={user.email}
                  onChange={handleChange}
                />
                <ButtonGroup justifyContent="center" size="sm">
                  <IconButton icon={<CloseIcon color="black"/>} onClick={() => {setEdit(false); handleReset();}} />
                  <IconButton icon={<CheckIcon color="black"/>} onClick={handleSubmit} />
                </ButtonGroup>
              </Stack>
              :
              <Stack spacing={5}>
                <h5>{user.name}</h5>
                <h5>{user.email}</h5>
                <Flex justifyContent="center">
                  <IconButton size="sm" icon={<EditIcon color="black"/>} onClick={() => setEdit(true)} />
                </Flex>
              </Stack>
            }
          </div>
        </div>
      }
    </>
  ); 
}