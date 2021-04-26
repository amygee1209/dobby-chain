import React, {useState, useEffect} from 'react';
import './CheckIn.css';
import CheckInItem from './CheckInItem';
import {
  useToast,
  CircularProgress
} from "@chakra-ui/react";
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function CheckIn({address, onboardState}) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [missedEvents, setMissedEvents] = useState([]);
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.allUsers.selUser)

  //design
  const toast = useToast();
  const toastIdRef = React.useRef();

  const fetchEventLists = async () => {
    console.log("fetching event lists...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/checkin?address=${address}`, )
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      console.log(res.data)
      setCompletedEvents(res.data.completed)
      setUpcomingEvents(res.data.upcoming)
      setMissedEvents(res.data.missed)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventLists ();
  }, [user, status])

  function handleSubmit(eventId, inputKey) {
    let formData = new FormData();
    formData.append('eventId', eventId); 
    formData.append('password', inputKey); 
    formData.append('address', address); 
    console.log(eventId, inputKey, address)
    axios.post(`https://dobchain-testing.herokuapp.com/checkin`, formData)
      .then(res => { 
        console.log(res.data.curr_status)
        setStatus(res.data.curr_status)
        toastIdRef.current = toast({ description: res.data.curr_status })
      })
  };

  
  const upcomingE = upcomingEvents.map(event => 
    <CheckInItem event={event} handleSubmit={handleSubmit} key={event.eid} />
  )
  const completedE = completedEvents.map(event => 
    <CheckInItem event={event} key={event.eid} />
  )
  const missedE = missedEvents.map(event => 
    <CheckInItem event={event} key={event.eid} />
  )

  

  return (
    <div>
      {!onboardState.address ?
        <h2>Please Connect Wallet</h2>
        :
        <div>
        {loading ?
          <CircularProgress isIndeterminate color="green.300" />
          :
          <div id="checkin">
            <div className="event-item">
              <h2>Upcoming 이벤트</h2>
              <div>
                {
                  upcomingEvents.length === 0 ?
                  <p>You have no upcoming events!</p>
                  : upcomingE
                }
              </div>
            </div>

            <div className="event-item">
              <h2>참여한 이벤트</h2>
              <div>
                {
                  completedEvents.length === 0 ?
                  <p>You have no completed events!</p>
                  : completedE
                }
              </div>
            </div>

            <div className="event-item">
              <h2>Missed 이벤트</h2>
              <div>
                {
                  missedEvents.length === 0 ?
                  <p>You have no upcoming events!</p>
                  : missedE
                }
              </div>
            </div>
          </div>
        }
        </div>
      }
    </div>
  )
}

