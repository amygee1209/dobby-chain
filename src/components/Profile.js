import React, {useState, useEffect} from 'react';
import './Profile.css';
import {
  Button,
  Input,
  Stack,
  useToast,
  CircularProgress
} from "@chakra-ui/react";
import axios from 'axios';

export default function Profile({address}) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  //design
  const toast = useToast();
  const toastIdRef = React.useRef();

  const fetchUser = async () => {
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/member?address=${address}`)
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      console.log(res.data);
      setUser(res.data)
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [address, loading])

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
      console.log(res.data.status)
      toastIdRef.current = toast({ description: "Your info has been updated!" })
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateUserInfo();
    setEdit(false);
  }

  function handleChange(e) {
    const {name, value} = e.target
    if (name === "name") {
      setName(value)
    } else {
      setEmail(value)
    }
  }

  return (
    <div>
      {user === {} ?
        <h2>Please connect your wallet</h2>
        :
        <div>
        {user === undefined?
          <div>
            <h1>Your are not a registered member</h1>
            <h2>Please ask the officer to be registered</h2>
          </div>
          :
          <div>
          {loading?
            <CircularProgress isIndeterminate color="blue.300" />
            :
            <div className="profile">
              <img src={user.img} alt="headshot"/>
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
                    <Button onClick={handleSubmit} colorScheme="teal" variant="outline">
                      Finish Edit
                    </Button>
                  </Stack>
                  :
                  <Stack spacing={5}>
                    <h5>{user.name}</h5>
                    <h5>{user.email}</h5>
                    <Button onClick={() => setEdit(true)} colorScheme="teal" variant="outline">
                      Edit Profile
                    </Button>
                  </Stack>
                }
              </div>
            </div>
          }
          </div>
        }
        </div>
        
      }
    </div>
  ); 
}