import React, {useEffect, useState} from 'react';
import './Ranking.css';
import UserRank from './UserRank';
import { CircularProgress} from "@chakra-ui/react";

//redux imports
import { setUsers } from './../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function Ranking({address, onboardState}) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myRank, setMyRank] = useState(null);
  
  //redux
  const user = useSelector((state) => state.allUsers.selUser)
  const dispatch = useDispatch()

  const fetchUsers = async () => {
    console.log("fetching...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/members`)
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      dispatch(setUsers(res.data))
      const sorted = res.data.sort((a, b) => b.num_points - a.num_points);
      //console.log(sorted)
      const ranking = sorted.map(person => {
        const rankIndex = sorted.findIndex(p => person.uid === p.uid)+1
        //console.log(person.address, rankIndex)
        if (person.address == address) {
          setMyRank(rankIndex)
        }
        return ({...person, rank: rankIndex})
      })
      setRanking(ranking);
      setLoading(true);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [user])

  const top1Rank = ranking.slice(0,1).map(person =>
    <UserRank user={person} rankingSel={1} key={person.uid} />
  )
  const top2Rank = ranking.slice(1,2).map(person =>
    <UserRank user={person} rankingSel={2} key={person.uid} />
  )
  const top3Rank = ranking.slice(2,3).map(person =>
    <UserRank user={person} rankingSel={3} key={person.uid} />
  )
  const restRank = ranking.slice(3).map(person => 
    <UserRank user={person} rankingSel={0} key={person.uid} />
  )

  return (
      <div id="ranking">
        {!onboardState.address ?
          <div className="my-ranking">
            <h2>Please connect your wallet</h2>
          </div>
          :
          <div className="my-ranking">
            <h2>My rank</h2>
            <div className="my-ranking-box">
              <img src={user.img} id="my-img" alt="headshot"/>
              <p>Rank #{myRank}</p>
              <p>{user.name}</p>
              <p>{user.num_points} points</p>
            </div>
          </div>
        }
      {loading ?
        <div>
          <h2>명예의 전당</h2>
          <p>Number of ppl: {ranking.length}</p>
          <div className="total-ranking">
            {top2Rank}
            {top1Rank}
            {top3Rank}
          </div>
          <h2>Rest ranking</h2>
          <div className="total-ranking ranking-wrap">
            {restRank}
          </div>
        </div>
      :
      <CircularProgress isIndeterminate color="green.300" />
    }
    </div>
  )
}