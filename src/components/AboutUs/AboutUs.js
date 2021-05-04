import './AboutUs.css';
import AboutUsDB from './AboutUsDB';
import MemberAbt from './MemberAbt';
import { Stack } from "@chakra-ui/react";

export default function AboutUs() {
  const allMembers = AboutUsDB.map(member => {
    return(
      <MemberAbt member={member} />
    )
  })

  return(
    <Stack id="about-us" spacing="50px">
      {/* <Stack id="about-us" spacing="24px">
        <h1>Dobby Story</h1>
        <div>
          <p>what is this website about?</p>
          <p>홍보 영상 올리기</p>
          <p>journey</p>
          <p>로그인</p>
          <p>체크인 하고</p>
          <p>옥션 하고</p>
          <p>프로필 편집하고</p>
        </div>
      </Stack> */}
      <Stack id="about-us" spacing="24px">
        <h1>Team</h1>
        <div id="about-us-teams">
          {allMembers}
        </div>
      </Stack>
    </Stack>
  )
}