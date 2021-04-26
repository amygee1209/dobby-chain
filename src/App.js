import React, {useState, useEffect} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

//redux imports
import { selectedUser } from './redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

//Import components
import Navbar from './components/Main/Navbar';
import Main from './components/Main/Main';
import CheckIn from './components/CheckIn/CheckIn';
import Ranking from './components/Rank/Ranking';
import Profile from './components/Profile';
import Auction from './components/Auction/Auction';
import Officer from './components/Officer/Officer';
import AboutUs from './components/AboutUs/AboutUs';
import Footer from './components/Main/Footer';

//blockchain related
import initOnboard from './utils/initOnboard';
import Web3 from 'web3'

export default function App() {
  //deployment
  //const domain = 'https://localhost:5000';
  //const domain = 'https://dobchain-testing.herokuapp.com';
  
  //blockchain related
  const [onboard, setOnboard] = useState(null);
  const [wallet, setWallet] = useState({});
  const [address, setAddress] = useState(null);
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
    
  }, []);

  useEffect(() => {
    const prevWallet = window.localStorage.getItem('selectedWallet');
    if (prevWallet && onboard) {
      onboard.walletSelect(prevWallet);      
    }
    //fetch api
    console.log(address)
    if (address) {
      fetchUser();
    }
  }, [address, onboard]);

  //redux
  const user = useSelector((state) => state.allUsers.selUser)
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/member?address=${address}`)
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      console.log(res.data);
      dispatch(selectedUser(res.data))
    }
  }
  
  
  return onboard ? (
    <div>
      <Router>
        <div id="page-container">
          <div id="content-wrap">
            <Navbar onboard={onboard} onboardState={onboard ? onboard.getState() : null}/>
            <div className="display-center">
              <Switch>
                <Route path="/" exact component={Main}/>
                <Route path="/checkin"><CheckIn address = {address} onboardState={onboard ? onboard.getState() : null}/></Route>
                <Route path="/ranking"><Ranking address = {address} onboardState={onboard ? onboard.getState() : null}/></Route>
                <Route path="/auction"><Auction address = {address} onboardState={onboard ? onboard.getState() : null}/></Route>
                <Route path="/officer"><Officer address = {address} onboardState={onboard ? onboard.getState() : null}/></Route>
                <Route path="/profile"><Profile address = {address} /></Route>
                <Route path="/about-us" component={AboutUs}/>
                <Route>404 Not Found</Route>
              </Switch>
            </div>
          </div>
          <div id="footer-section">
            <Footer />
          </div>
        </div>
      </Router>
    </div>
  ): (
    <div>Loading...</div>
  )
}