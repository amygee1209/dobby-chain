import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { 
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton
 } from "@chakra-ui/react";
import { 
  HamburgerIcon, 
  CloseIcon
} from '@chakra-ui/icons';
import axios from 'axios';


export default function Navbar({onboard, onboardState, themeBtn}) {
  const [name, setName] = useState(undefined);
  let address = onboardState.address;

  async function readyToTransact() {
    if (!onboardState.address) {
      const walletSelected = await onboard.walletSelect();
      if (!walletSelected) return false;
    }

    const ready = await onboard.walletCheck();
    return ready;
  }

  const walletBtn = !onboardState.address ?
    <Button onClick={() => readyToTransact()} colorScheme="teal" variant="outline">
      Connect Wallet
    </Button>
    :
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="teal" variant="outline">
          {name}
        </Button>
      </PopoverTrigger>
      <PopoverContent width="300px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <p>Welcome back {name}</p>
        </PopoverHeader>
        <PopoverBody>
          <p>Need Help?</p>
          <a href="https://www.youtube.com/watch?v=EPVxE7zXx20" className="tutorial-link"  target="_blank" rel="noopener noreferrer">
            Try this tutorial!
          </a>
        </PopoverBody>
        <PopoverFooter>
          <p>Change mode {themeBtn}</p>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
    

  const [menuClick, setmenuClick] = useState(false);

  const handleClick = () => setmenuClick(!menuClick);
  const closeMenu = () => setmenuClick(false);

  function fetchUser(addr) {
    axios.get(`https://dobchain-testing.herokuapp.com/member?address=${addr}`)
      .then(res => {
        console.log(res.data);
        setName(res.data.memberInfo.name) 
      })
      .catch((err) => {
        console.log("Error:", err);
      })
    }

  useEffect(() => {
    fetchUser(address);
  }, [address]);

  return (
    <div>
      <div className="display-center">
        <nav className="navbar">
          <Link to="/" className="logo-name">Dobby Chain</Link>
          <div className='menu-icon' onClick={handleClick}>
            {menuClick?
              <CloseIcon w={6} h={6}/>
              : 
              <HamburgerIcon w={6} h={6}/>
            }
          </div>
          
          <ul className={menuClick ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to="/checkin" onClick={closeMenu} className='nav-links'>Check In</Link>
            </li>
            <li className='nav-item'>
              <Link to="/ranking" onClick={closeMenu} className='nav-links'>Ranking</Link>
            </li>
            <li className='nav-item'>
              <Link to="/auction" onClick={closeMenu} className='nav-links'>Auction</Link>
            </li>
            <li className='nav-item'>
              <Link to="/officer" onClick={closeMenu} className='nav-links'>Admin</Link>
            </li>
            <li className='nav-item'>
              <Link to="/profile" onClick={closeMenu} className='nav-links'>Profile</Link>
            </li>
            <li className="wallet-btn">{walletBtn}</li>
          </ul>
            
        </nav> 
      </div>
    </div>
  )
}