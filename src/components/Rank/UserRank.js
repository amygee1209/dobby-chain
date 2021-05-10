import './UserRank.css';
import defaultImg from './../../img/default.jpg';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Stack, HStack
} from "@chakra-ui/react";
import { 
  EmailIcon,
  ChatIcon,
  InfoOutlineIcon
} from '@chakra-ui/icons';

export default function MyRank({user, rankingSel, selfVerify}) {
  const designClass = rankingSel === 0 ?
    `rest-ranking ${selfVerify}` : `top3-ranking top${rankingSel}`

  const { isOpen, onOpen, onClose } = useDisclosure();
  let rankEmoji = null;
  if (rankingSel === 1) {
    rankEmoji = "🥇";
  } else if (rankingSel === 2) {
    rankEmoji = "🥈";
  } else if (rankingSel === 3) {
    rankEmoji = "🥉";
  }
    
  return(
    <>
      <div onClick={onOpen} className={`${designClass} ranking-display`}>
        {user.img ?
          <img src={user.img} className="profile-img" alt="headshot"/>
          :
          <img src={defaultImg} className="profile-img" alt="headshot"/>
        }
        <h5>Rank #{user.rank}</h5>
        <p>{user.name} {rankEmoji}</p>
        <p>{user.num_points} points</p>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {user.name}
            <div className="display-email">
              <EmailIcon/> {user.email}
            </div>
            <div className="display-email">
              <InfoOutlineIcon/> {user.address}
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="20px">
              <Stack spacing="10px">
                <p>Comments</p>
                <HStack spacing="10px">
                  <Input placeholder="comment" size="sm" />
                  <ChatIcon/>
                </HStack>
                Commenting service COMING SOON!
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}