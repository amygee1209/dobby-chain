import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { Button } from "@chakra-ui/react";
import { 
  HamburgerIcon, 
  CloseIcon } from '@chakra-ui/icons';

export default function Navbar({onboard, onboardState}) {
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
    <Button colorScheme="teal" variant="outline">
      {`${address?.substr(0, 6)}...${address?.substr(address.length - 4)}`}
    </Button>

  const [menuClick, setmenuClick] = useState(false);

  const handleClick = () => setmenuClick(!menuClick);
  const closeMenu = () => setmenuClick(false);

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
              <Link to="/officer" onClick={closeMenu} className='nav-links'>Officer</Link>
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