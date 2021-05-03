import React, {useEffect, useState} from 'react';
import './Ranking.css';
import UserRank from './UserRank';
import { CircularProgress } from "@chakra-ui/react";
import axios from 'axios';

export default function Ranking({address}) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myRank, setMyRank] = useState(0);
  const [user, setUser] = useState(undefined);
  
  const fetchUsers = async () => {
    console.log("fetching all members...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/members`)
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      const sorted = res.data.sort((a, b) => b.num_points - a.num_points);
      //console.log(sorted)
      const ranking = sorted.map(person => {
        const rankIndex = sorted.findIndex(p => person.uid === p.uid)+1
        //console.log(person.address, rankIndex)
        if (person.address === address) {
          setMyRank(rankIndex)
        }
        return ({...person, rank: rankIndex})
      })
      setRanking(ranking);
      setLoading(true);
    }
    fetchUser();
  }

  const fetchUser = async () => {
    console.log("fetching member...")
    const res = await axios
      .get(`https://dobchain-testing.herokuapp.com/member?address=${address}`)
      .catch((err) => {
        console.log("Error:", err);
      })
    if (res) {
      console.log(res.data);
      setUser(res.data.memberInfo)
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [address])

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
      <div className="my-ranking">
        <h1>My rank</h1>
        <div className="my-ranking-box">
          {!user ?
            <h3>Please connect your wallet</h3>
            :
            <>
              {!user.img?
                <p>{user.name}</p>
                :
                <>
                  <img src={user.img} id="my-img" alt="headshot"/>
                  <p>Rank #{myRank}</p>
                  <p>{user.name}</p>
                  <p>{user.num_points} points</p>
                </>
              }
            </>
          }
        </div>
      </div>

      {loading ?
        <div>
          <h1>Hall of Fame</h1>
          <div className="total-ranking">
            {top2Rank}
            {top1Rank}
            {top3Rank}
          </div>
          <hr/>
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