import './AboutUs.css';

export default function MemberAbt({name, img, profile}) {
  return (
    <div className="member-about">
      <a href={profile}>
        <img src={img} alt="member img" />
        <h2>{name}</h2>
      </a>
    </div>
  )
}