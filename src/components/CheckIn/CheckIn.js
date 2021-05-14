import React, {useState, useEffect} from 'react';
import './CheckIn.css';
import CheckInItem from './CheckInItem';
import { CircularProgress } from "@chakra-ui/react";
import axios from 'axios';

export default function CheckIn({address}) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [missedEvents, setMissedEvents] = useState([]);
  const [loading, setLoading] = useState(true)


  const fetchEventLists = async () => {
    console.log("fetching event lists...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/checkin?address=${address}`, )
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      console.log(res.data);
      setCompletedEvents(res.data.completed);
      setUpcomingEvents(res.data.upcoming);
      setMissedEvents(res.data.missed);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEventLists();
  }, [address])

  
  const upcomingE = upcomingEvents.map(event => 
    <CheckInItem event={event} address={address} checkinEnable={true} key={event.eid} />
  )
  const completedE = completedEvents.map(event => 
    <CheckInItem event={event} checkinEnable={false} key={event.eid} />
  )
  const missedE = missedEvents.map(event => 
    <CheckInItem event={event} checkinEnable={false} key={event.eid} />
  )

  
  return (
    <>
      {loading ?
        <CircularProgress isIndeterminate color="green.300" />
        :
        <div id="checkin">
          <div className="event-item">
            <h3>Upcoming Events</h3>
            <div>
              {
                upcomingEvents.length === 0 ?
                <p>There are no upcoming events!</p>
                : upcomingE
              }
            </div>
          </div>

          <div className="event-item">
            <h3>Completed Events</h3>
            <div>
              {
                completedEvents.length === 0 ?
                <p>There are no completed events!</p>
                : completedE
              }
            </div>
          </div>

          <div className="event-item">
            <h3>Missed Events</h3>
            <div>
              {
                missedEvents.length === 0 ?
                <p>There are no missed events!</p>
                : missedE
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

