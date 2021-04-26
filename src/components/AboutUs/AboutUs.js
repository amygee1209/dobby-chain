import './AboutUs.css';
import MemberAbt from './MemberAbt';

export default function AboutUs() {
  const link = "https://www.ladbible.com/cdn-cgi/image/width=720,quality=70,format=jpeg,fit=pad,dpr=1/https%3A%2F%2Fs3-images.ladbible.com%2Fs3%2Fcontent%2Ffcbcb4795f6d2949128304106aea0d5a.png"

  return(
    <div id="about-us">
      <div className="team">
        <h1>Project chairs</h1>
        <div className="team-member">
          <MemberAbt name="Chris Kim 김형근" img={link}/>
          <MemberAbt name="Jisu Han 한지수" img={link}/>
        </div>
      </div>
      <div className="team">
        <h1>Business team</h1>
        <div className="team-member">
          <MemberAbt name="Heesoo Kim 김희수" img={link}/>
          <MemberAbt name="조수빈" img={link}/>
          <MemberAbt name="Seungtaek Oh 오승택" img={link}/>
        </div>
      </div>
      <div className="team">
        <h1>Front-end team</h1>
        <div className="team-member">
          <MemberAbt name="Amy Kwon 권예은" img={link}/>
          <MemberAbt name="김성윤" img={link}/>
        </div>
      </div>
      <div className="team">
        <h1>Back-end team</h1>
        <div className="team-member">
          <MemberAbt name="Brian Lee 이범진" img={link}/>
        </div>
      </div>
      <div className="team">
        <h1>Smart contract team</h1>
        <div className="team-member">
          <MemberAbt name="Kathy Lee 이경민" img={link}/>
          <MemberAbt name="Harold Kim 김항식" img={link}/>
        </div>
      </div>
    </div>
  )
}