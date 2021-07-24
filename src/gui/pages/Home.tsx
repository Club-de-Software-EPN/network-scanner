/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = window.require('electron');

import React, { useState, useEffect } from 'react';
import { Progress, Text, VStack, Button } from '@chakra-ui/react';

import Waves from '../components/Waves';
import Logo from '../components/Logo';
import Host from '../components/Host';

export type hostInfo = {
  port: number,
  banner: string,
  status: string,
}

export type host ={
  ip: string,
  info: hostInfo[],
}

const Home = (): JSX.Element => {

  const [hosts, setHosts] = useState<host[]>([]);
  const [currentHost, setCurrentHost] = useState('');
  const [loadHosts, setLoadHosts] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      ipcRenderer.removeAllListeners('discover-network-response');
      ipcRenderer.removeAllListeners('current-data');
    }
  }, []);

  const handleClick = (): void => {
    setLoadHosts(true);
    ipcRenderer.send('discover-network');
    ipcRenderer.on('discover-network-response', (_, args) => {
      console.log(args);
      setLoadHosts(false);
      setProgress(0);
      setCurrentHost('');
    });
  
    ipcRenderer.on('current-data', (_, data) => {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      setCurrentHost(parsedData.currentHost);
      setProgress(parsedData.progress);
    });

    ipcRenderer.on('host-response', (_, data) => {
      const parsedData = JSON.parse(data);
      setHosts((prevHosts) => {
        return [...prevHosts, { ip: parsedData.host, info: []}];
      })
      ipcRenderer.send('scan', parsedData.host);
      new window.Notification('Host response', { body: `Host ${parsedData.host} is available in your network` });
    })

    ipcRenderer.on('scanned-host', (_, data) => {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      setHosts((prevHosts) => {
        const newHosts = prevHosts.map((host) => {
          if (host.ip === parsedData.ip) {
            return {
              ip: host.ip,
              info: [...host.info, {
                port: parsedData.port,
                banner: parsedData.banner,
                status: parsedData.status,
              }]
          }
        }
        return host;
      });
      return newHosts;
    });
  });
};

const handleCancelClick = (): void => {
  ipcRenderer.send('cancel-scan');
  ipcRenderer.removeAllListeners('discover-network-response');
  ipcRenderer.removeAllListeners('current-data');
  ipcRenderer.removeAllListeners('host-response');
  ipcRenderer.removeAllListeners('scanned-host');
  setLoadHosts(false);
  setProgress(0);
}

  return (
    <VStack minH="calc(100vh - 70px)" spacing="50px" display="flex" flexDir="column" justifyContent="space-between">
      <VStack spacing="50px">
        <Text fontSize="6xl" fontWeight="bold">Network Scanner</Text>
        { !loadHosts ? <Button onClick={handleClick} variant="solid" >Discover Network</Button> :
        <Button onClick={handleCancelClick} variant="solid" colorScheme="red" >Cancel</Button>
        }
        { loadHosts && <VStack spacing="20px">
          <Text>Current Host: {currentHost}</Text>
          <Progress colorScheme="purple" size="lg" display={loadHosts ? 'flex' : 'none'} w="500px" value={progress}/>
          <Text fontSize="5xl">Devices in your network</Text>
          {hosts.map((host) => (
            <Host host={host}/>
          ))}
        </VStack>
        }
      </VStack>
      <VStack>
        <Text mb="-50px" zIndex="2" fontSize="sm">Powered by</Text>
        <Logo height="200px" />
      </VStack>
      <Waves style={{position: 'fixed', left:-25, top: -50, transform: 'scaleY(1.5)'}}/>
      <Waves style={{position: 'fixed', right:-25, top: -50, transform: 'scaleX(-1) scale(1.9) scaleY(-1)'}}/>
    </VStack>
  );
};

export default Home;
