import './UserRank.css';
import crown from './../../img/crown.png';
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
  Stack, HStack,
  Flex
} from "@chakra-ui/react";
import { 
  EmailIcon,
  ChatIcon,
  DeleteIcon,
  InfoOutlineIcon
} from '@chakra-ui/icons';

export default function MyRank({user, rankingSel}) {
  const designClass = rankingSel === 0 ?
    "rest-ranking" : `top3-ranking top${rankingSel}`

  const { isOpen, onOpen, onClose } = useDisclosure();
    
  return(
    <>
      <div onClick={onOpen} className={`${designClass} ranking-display`}>
        {/* {rankingSel === 1 ?
          <img src={crown} className="crown-img" alt="crown"/> : null
        } */}
        {user.img ?
          <img src={user.img} className="profile-img" alt="headshot"/>
          :
          <img src={defaultImg} className="profile-img" alt="headshot"/>
        }
        <h5>Rank #{user.rank}</h5>
        <p>{user.name}</p>
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