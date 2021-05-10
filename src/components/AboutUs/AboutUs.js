import './AboutUs.css';
import AboutUsDB from './AboutUsDB';
import FoundingDB from './FoundingDB';
import MemberAbt from './MemberAbt';
import { Stack } from "@chakra-ui/react";

export default function AboutUs() {
  const allMembers = AboutUsDB.map(member => {
    return(
      <MemberAbt member={member} founding={false} />
    )
  })

  const foundingMem = FoundingDB.map(member => {
    return(
      <MemberAbt member={member} founding={true} />
    )
  })

  return(
    <Stack id="about-us" spacing="50px">
      <h1>Dobby Story</h1>
      <div>
        <p
          style={{textIndent: "40px"}}
        >
          DobbyChain is a blockchain based P2P token trading platform. 
          Founded in Fall 2020, DobbyChain has become the ultimate platform for 
          KSEA members to manage their club activities and most importantly, 
          to get concrete incentives for their participation. Our technical approach 
          to incentivization through a unique, custom ERC-20 token is unparalleled. 
          We work with exceptional talent from UC Berkeley across different fields 
          ranging from computer science & EECS to economics and business. 
        </p>
        <br/>
        <p
          style={{textIndent: "40px"}}
        >
          We launched the DobbyChain Platform in Spring 2021, 
          and our pool of opportunities are growing across fields as 
          we plan to constructively and fearlessly expand our scope of business. 
          We are certain that you’ll find an opportunity that best fits 
          your background and vision. Join our team to gain a professional edge, 
          and more importantly - immerse yourself in the revolutionary blockchain technology. 
        </p>
        <br/>
        <p>
          Please direct any questions to 
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=heesoo_kim@berkeley.edu" target="_blank"
            style={{color: "blue", marginLeft: "3px"}}
          >
            heesoo_kim@berkeley.edu
          </a>
          </p>
      </div>
      <Stack id="about-us" spacing="24px">
        <h1>Team</h1>
        <div id="about-us-teams">
          {allMembers}
        </div>
        <h1>Founding Members</h1>
        <div id="about-us-teams">
          {foundingMem}
        </div>
      </Stack>
    </Stack>
  )
}