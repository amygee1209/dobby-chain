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
  Input
} from "@chakra-ui/react"

export default function CheckInItem({event, handleSubmit}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ inputKey, setInputKey ] = useState("");

  function handleChange(e) {
    setInputKey(e.target.value);
  }
 
  return (
    <div className="item">
      <div className="check-in-item">
        <div className="check-in-info">
          <h3>{event.eventName}</h3>
          <p>Event points: {event.pointAmount}</p>
          <p>Created At: {event.dueDate} + {event.timeLimit} minutes</p>
        </div>
        {handleSubmit === undefined ? 
          <div>
            <Button  className="btn" colorScheme="green" onClick={onOpen}>
              Details
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{event.eventName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>Event ID: {event.eid}</p>
                  <p>Event Details: {event.eventDetails}</p>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          :
          <div>
            <Button className="btn" colorScheme="blue" onClick={onOpen}>
              Check In
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Put Secret Key</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>Event ID: {event.eid}</p>
                  <p>Event Details: {event.eventDetails}</p>
                  <Input type="text"
                    value={inputKey}
                    placeholder="Secret Key"
                    onChange={handleChange}
                  />
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button 
                    variant="ghost" 
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