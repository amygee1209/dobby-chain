import './UserRank.css';
import crown from './../../img/crown.png'

export default function MyRank({user, rankingSel}) {
  const designClass = rankingSel === 0 ?
    "rest-ranking" : `top3-ranking top${rankingSel}`
    
  return(
    <div className={`${designClass} ranking-display`}>
      {rankingSel === 1 ?
        <img src={crown} className="crown-img" alt="crown"/> : null
      }
      <img src={user.img} className="profile-img" alt="headshot"/>
      <h5>Rank #{user.rank}</h5>
      <p>{user.name}</p>
      <p>{user.num_points} points</p>
    </div>
  )
}