import React, {useState, useEffect} from 'react';
import './Content.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

//Import components
import Navbar from './Main/Navbar';
import Main from './Main/Main';
import CheckIn from './CheckIn/CheckIn';
import Ranking from './Rank/Ranking';
import Profile from './Profile';
import Auction from './Auction/Auction';
import Officer from './Officer/Officer';
import AboutUs from './AboutUs/AboutUs';
import Footer from './Main/Footer';
import NotFound from './NotFound';

//blockchain related
import initOnboard from './../utils/initOnboard';
import Web3 from 'web3'

//design
import styled from "styled-components";
import {
  MoonIcon,
  SunIcon
} from '@chakra-ui/icons';

const ModeIcon = styled.button`
  cursor: pointer;
  height: 30px;
  width: 30px;   
  border-radius: 50%;
  border: none;
  background-color: ${props => props.theme.iconColor};
  color: ${props => props.theme.textColor};
  &:focus {
    outline: none;
  }
  transition: all .5s ease;
`;

const Page = styled.div`
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.pageBackground};
  transition: all .5s ease;
`;


export default function Content(props) {
  //design
  const icon = props.theme === "light" ? <MoonIcon boxSize={4} /> : <SunIcon boxSize={4} />;
  const themeBtn = <ModeIcon onClick={changeTheme}>{icon}</ModeIcon>
  
  function changeTheme() {
    if (props.theme === "light") {
      props.setTheme("dark");
      window.localStorage.setItem('theme', "dark");
    } else {
      props.setTheme("light");
      window.localStorage.setItem('theme', "light");
    }
  };

  //blockchain
  const [onboard, setOnboard] = useState(null);
  const [wallet, setWallet] = useState({});
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [, setNetwork] = useState(null);


  const web3 = new Web3(wallet.provider);
  useEffect(() => {
    const ob = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setBalance,
      wallet: (w) => {
        if (w.provider) {
          setWallet(w);
          window.localStorage.setItem('selectedWallet', w.name);
        } else {
          setWallet({});
        }
      },
    });

    setOnboard(ob);
    // console.log("Address:" + address);
    let prevTheme = window.localStorage.getItem('theme');
    if (prevTheme) {
      props.setTheme(prevTheme);
    }    
  }, []);

  useEffect(() => {
    const prevWallet = window.localStorage.getItem('selectedWallet');
    if (prevWallet && onboard) {
      onboard.walletSelect(prevWallet);      
    }
  }, [address, onboard]);


  return onboard ? (
    <Page>
      <Router>
        <div id="page-container">
          <div id="content-wrap">
            <Navbar onboard={onboard} themeBtn={themeBtn} onboardState={onboard ? onboard.getState() : null}/>
            <div className="display-center">
              <Switch>
                <Route path="/" exact component={Main}/>
                <Route path="/checkin"><CheckIn address={address} /></Route>
                <Route path="/ranking"><Ranking address={address} /></Route>
                <Route path="/auction"><Auction address={address} /></Route>
                <Route path="/officer"><Officer address={address}/></Route>
                <Route path="/profile"><Profile address={address} /></Route>
                <Route path="/about-us" component={AboutUs}/>
                <Route component={NotFound}/>
              </Switch>
            </div>
          </div>
          <div id="footer-section">
            <Footer />
          </div>
        </div>
      </Router>
    </Page>
  ): (
    <div>Loading...</div>
  )
}