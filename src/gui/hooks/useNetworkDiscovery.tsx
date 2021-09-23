import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

export type hostInfo = {
  port: number,
  banner: string,
  status: string,
}

export type host ={
  ip: string,
  info: hostInfo[],
}

const listeners = [
  'current-data',
  'host-response',
  'scanned-host'
]

export type useNetworkDiscovery = {
  hosts: host[],
  currentHost: string,
  progress: number,
  loading: boolean,
  scan: () => void,
  cancel: () => void,
}

export const useNetworkDiscovery = (): useNetworkDiscovery  => {
  const [hosts, setHosts] = useState<host[]>([]);
  const [currentHost, setCurrentHost] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  //TODO Implement finish logic 
  const scan = (): void => {
    setLoading(true);
    ipcRenderer.send('discover-network');
    ipcRenderer.on(listeners[0], (_, data) => {
      const parsedData = JSON.parse(data);
      setCurrentHost(parsedData.currentHost);
      setProgress(parsedData.progress);
    });

    ipcRenderer.on(listeners[1], (_, data) => {
      const parsedData = JSON.parse(data);
      ipcRenderer.send('scan', parsedData.host);
      setHosts((prevHosts) => {
        return [...prevHosts, { ip: parsedData.host, info: []}];
      })
      new window.Notification('Host response', { body: `Host ${parsedData.host} is available in your network` });
    });

    ipcRenderer.on(listeners[2], (_, data) => {
      const parsedData = JSON.parse(data);
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
  }

  const cancel = (): void => {
    ipcRenderer.send('cancel-scan');
    setCurrentHost(null);
    setHosts(null);
    setLoading(false);
    setProgress(0);
  }

  return {
    hosts,
    currentHost,
    progress,
    loading,
    scan,
    cancel
  }
}
