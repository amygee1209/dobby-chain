import React, {useState} from 'react';
import './CheckInItem.css';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input, Stack, Badge, HStack,
  useToast
} from "@chakra-ui/react";
import { SmallAddIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function CheckInItem({event, address, checkinEnable}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ inputKey, setInputKey ] = useState("");

  //design
  const toast = useToast();
  const toastIdRef = React.useRef();

  function handleChange(e) {
    setInputKey(e.target.value);
  }

  function handleSubmit(eventId, inputKey) {
  let formData = new FormData();
  formData.append('eventId', eventId); 
  formData.append('password', inputKey); 
  formData.append('address', address);
  axios.post(`https://dobchain-testing.herokuapp.com/checkin`, formData)
    .then(res => { 
      console.log(res.data)
      const dataStatus = res.data.status;
      toastIdRef.current = toast({
        title: dataStatus.charAt(0).toUpperCase() + dataStatus.slice(1),
        description: res.data.statusDes,
        status: dataStatus,
        duration: 10000,
        isClosable: true,
      })
      handleClose();
    })
  }

  function handleClose() {
    setInputKey('');
    onClose();
  }
 
  return (
    <div className="item">
      <div className="check-in-item">
        <div className="check-in-info">
          <HStack>
            <h3>{event.eventName}</h3>
            <Badge fontSize="1.6vh" colorScheme="red" className="point-box">
              <SmallAddIcon/>{event.pointAmount} points
            </Badge>
          </HStack>
          <p>Created At: {event.dueDate} + {event.timeLimit} minutes</p>
        </div>
        {!checkinEnable ? 
          <div>
            <Button  className="btn" colorScheme="green" onClick={onOpen}>
              Details
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{event.eventName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing="10px">
                    <p>Event ID: {event.eid}</p>
                    <div>
                      <p>Event Details:</p>
                      <p style={{marginLeft: '15px'}}>{event.eventDetails}</p>
                    </div>
                  </Stack>
                </ModalBody>

                <ModalFooter>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          :
          <div>
            <Button className="btn" colorScheme="blue" onClick={onOpen}>
              Check In
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{event.eventName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing="10px">
                    <p>Event ID: {event.eid}</p>
                    <div>
                      <p>Event Details:</p>
                      <p style={{marginLeft: '15px'}}>{event.eventDetails}</p>
                    </div>
                    <div>
                      <p>Put secret key</p>
                      <Input type="text"
                        value={inputKey}
                        placeholder="Secret Key"
                        onChange={handleChange}
                      />
                    </div>
                  </Stack>
                </ModalBody>

                <ModalFooter>
                  <Button 
                    colorScheme="blue"
                    onClick={() => handleSubmit(event.eid, inputKey)}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        }
      </div>
    </div>
  )
}