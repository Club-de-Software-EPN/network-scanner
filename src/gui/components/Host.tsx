import React from 'react';
import {
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  HStack,
} from '@chakra-ui/react';
import { host } from '../pages/Home';

type Props = {
  host: host,
}

const Host = ({ host }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <HStack bg="#5C0F8B" borderRadius="15px" p="20px" cursor="pointer" transition="0.3s" _hover={{ transform: "scale(1.1)" }} onClick={onOpen} h="50px">
      <Text color="#F6F8FA" bg="inherit" fontSize="md">{host.ip}</Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Host: {host.ip}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table>
              <TableCaption>Scanner result</TableCaption>
              <Thead>
                <Tr>
                  <Th>Port</Th>
                  <Th>Status</Th>
                  <Th>Banner grabbing result</Th>
                </Tr>
              </Thead>
              <Tbody>
              {host.info.map(item => (
                <Tr>
                  <Td>{item.port}</Td>
                  <Td>{item.status}</Td>
                  <Td>{item.banner}</Td>
                </Tr>
              ))
              }
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
}

export default Host;
