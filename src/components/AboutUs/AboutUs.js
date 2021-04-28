import './AboutUs.css';
import MemberAbt from './MemberAbt';

export default function AboutUs() {
  const link = "https://www.ladbible.com/cdn-cgi/image/width=720,quality=70,format=jpeg,fit=pad,dpr=1/https%3A%2F%2Fs3-images.ladbible.com%2Fs3%2Fcontent%2Ffcbcb4795f6d2949128304106aea0d5a.png"
  const profile = "/"

  return(
    <div id="about-us">
      <div className="team">
        <h1>Project chairs</h1>
        <div className="team-member">
          <MemberAbt 
            name="Chris Kim 김형근" 
            img={link} 
            profile={profile}
          />
          <MemberAbt 
            name="Jisu Han 한지수" 
            img={link} 
            profile={profile}
          />
        </div>
      </div>
      <div className="team">
        <h1>Web Dev team</h1>
        <div className="team-member">
          <MemberAbt 
            name="Brian Lee 이범진" 
            img={link} 
            profile={profile}
          />
          <MemberAbt 
            name="Amy Kwon 권예은" 
            img={link} 
            profile={profile}
          />
          <MemberAbt 
            name="김성윤" 
            img={link} 
            profile={profile}
          />
        </div>
      </div>
      <div className="team">
        <h1>Smart contract team</h1>
        <div className="team-member">
          <MemberAbt 
            name="Kathy Lee 이경민" 
            img={link} 
            profile={profile}
          />
          <MemberAbt 
            name="Harold Kim 김항식" 
            img={link} 
            profile={profile}
          />
        </div>
      </div>
      <div className="team">
        <h1>Business team</h1>
        <div className="team-member">
          <MemberAbt 
            name="Heesoo Kim 김희수" 
            img={link} 
            profile={profile}
          />
          <MemberAbt 
            name="조수빈" 
            img={link} 
            profile={profile}
          />
          <MemberAbt 
            name="Seungtaek Oh 오승택" 
            img={link} 
            profile={profile}
          />
        </div>
      </div>
    </div>
  )
}