import React from 'react';
import { Progress, Text, VStack, Button, Center, Wrap, WrapItem } from '@chakra-ui/react';

import { useNetworkDiscovery } from '../hooks/useNetworkDiscovery';
import { motion } from 'framer-motion';

import Waves from '../components/Waves';
import Logo from '../components/Logo';
import Host from '../components/Host';

const Home = (): JSX.Element => {
  const {
    loading,
    currentHost,
    hosts,
    progress,
    scan,
    cancel
  } = useNetworkDiscovery();

  return (
    <VStack
      minH="calc(100vh - 70px)"
      minW="100%"
      spacing="50px"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
    >
      <VStack spacing="50px">
        <Text fontSize="6xl" fontWeight="bold">Network Scanner</Text>
      </VStack>
        <Center>
          { !loading ? <Button onClick={() => scan()} variant="solid" >Discover Network</Button> :
          <Button onClick={cancel} variant="solid" colorScheme="red" >Cancel</Button>
          }
        </Center>
        { loading && <VStack spacing="20px">
          <Text>Current Host: {currentHost}</Text>
          <Progress colorScheme="purple" size="lg" display={loading ? 'flex' : 'none'} w="500px" value={progress}/>
          <Text fontSize="5xl">Devices in your network</Text>
          <Wrap>
            {hosts.map((host) => (
              <WrapItem>
                <Host host={host}/>
              </WrapItem>
            ))}
          </Wrap>
        </VStack>
        }
      <VStack>
        <Text mb="-50px" zIndex="2" fontSize="sm">Powered by</Text>
        <Logo height="200px" />
      </VStack>
      { loading ? 
        (
          <>
            <motion.div
              style={{position: 'fixed', left:-25, top: -50, transform: 'scaleY(1.5)'}}
              animate={{ x: 10, y: 20, scaleX: 2.1, scaleY:2 }}
              transition={{ ease: "easeOut", duration: 6, repeat: Infinity, repeatType:'mirror'}}
            >
              <Waves/>
            </motion.div>
            <motion.div
              style={{position: 'fixed', right:-25, top: -50, transform: 'scaleX(-1) scale(1.9) scaleY(-1)'}}
              animate={{ x: 5, y: 20, scaleX: 1.3, scaleY: 1.3 }}
              transition={{ ease: "easeOut", duration: 5, repeat: Infinity, repeatType:'reverse'}}
            >
              <Waves
                style={{position: 'fixed', right:-25, top: -50, transform: 'scaleX(-1) scale(1.9) scaleY(-1)'}}
              />
            </motion.div>
          </>
        ) :
        (
          <>
            <Waves
              style={{position: 'fixed', left:-25, top: -50, transform: 'scaleY(1.5)'}}
            />
            <Waves
              style={{position: 'fixed', right:-25, top: -50, transform: 'scaleX(-1) scale(1.9) scaleY(-1)'}}
            />
          </>
        )

      }

    </VStack>
  );
};

export default Home;
