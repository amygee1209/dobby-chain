import './MemberAbt.css';

export default function MemberAbt({member, founding}) {

  return (
    <div id="member-about">
      {founding?
        <a 
          href={member.profile} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{filter: "grayscale(80%)"}}
        >
          <img src={member.img} alt="member img" />
          <h3>{member.english}</h3>
          <h4>{member.korean}</h4>
        </a>
        :
        <a href={member.profile} target="_blank" rel="noopener noreferrer">
          <img src={member.img} alt="member img" />
          <h3>{member.english}</h3>
          <h4>{member.korean}</h4>
          <p 
            className="position-box"
            style={{backgroundColor: member.boxColor1}}
          >
            {member.position1}
          </p>
          <p 
            className="position-box"
            style={{backgroundColor: member.boxColor2}}
          >
            {member.position2}
          </p>
        </a>
      }
    </div>
  )
}