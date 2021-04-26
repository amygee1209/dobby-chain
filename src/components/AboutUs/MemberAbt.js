import './AboutUs.css';
import { Stack } from "@chakra-ui/react"

export default function MemberAbt({name, img}) {
  return(
    <Stack spacing="24px" className="member-about">
      <img src={img} alt="member img" />
      <h2>{name}</h2>
    </Stack>
  )
}