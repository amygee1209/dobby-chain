import './Main.css';
import MainImg from './../../img/main.png';
import { Stack, HStack } from "@chakra-ui/react";
import { Link } from 'react-router-dom';

export default function Main() {
  return(
    <div>
      <HStack spacing="5vw" id="main">
        <Stack spacing="6vh">
          <h1>We build KSEA's economy</h1>
          <h3>Participate in KSEA events and earn prizes!</h3>
          <Link to="/about-us">
            <button type="button" className="abtus-btn">
              About Us
            </button>
          </Link>
        </Stack>
        <img src={MainImg} alt="main img"/>
      </HStack>
      <hr/>
      <iframe
        className="main-video"
        width="70%" 
        height="600" 
        src="https://www.youtube.com/embed/tJ5pvZYrFEc" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>
    </div>
  )
}