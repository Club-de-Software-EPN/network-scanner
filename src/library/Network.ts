import ip from 'ip';
import ping from 'ping';
import { BrowserWindow } from 'electron';

export type NetworkInformation = {
  ipAddress: string;
  netMask: string;
  cidr: number;
  firstAddress: string;
  lastAddress: string;
  hostsLength: number;
}

export type HostStatus = {
  ipAddress: string;
  ports: string[];
}

class Network {
  private ipAddress: string;
  private netMask: string;
  private CIDR: number;
  private networkAddress: string;
  private firstAddress: string;
  private lastAddress: string;
  private hostsLength: number;

  constructor(ipAddress= ip.address(), netMask = "255.255.255.0", CIDR= 24) {
    this.CIDR = CIDR;
    this.ipAddress = ipAddress;
    if (!netMask && CIDR) {
      this.netMask = ip.fromPrefixLen(this.CIDR);
    } else {
      this.netMask = netMask;
    }
    this.setNetworkInformation();
  }

  setNetworkInformation(): void {
    const {
      networkAddress,
      firstAddress,
      lastAddress,
      numHosts,
    } = ip.subnet(this.ipAddress, this.netMask);
    this.networkAddress = networkAddress;
    this.firstAddress = firstAddress;
    this.lastAddress = lastAddress;
    this.hostsLength = numHosts;
  }

  getNetworkInformation(): NetworkInformation {
    return {
      ipAddress: this.ipAddress,
      netMask: this.netMask,
      cidr: this.CIDR,
      firstAddress: this.firstAddress,
      lastAddress: this.lastAddress,
      hostsLength: this.hostsLength,
    };
  }

  public async pingHost(ipAddress: number): Promise<HostStatus> {
    let hostStatus: HostStatus = null;
    const pingResponse = await ping.promise.probe(ip.fromLong(ipAddress));
    if (pingResponse.alive) {
      hostStatus = {
        ipAddress: ip.fromLong(ipAddress),
        ports: [],
      };
    }
    return hostStatus;
  }

  async discover (mainWindow: BrowserWindow): Promise<void> {
    let progress = 1;
    for (
      let i = ip.toLong(this.firstAddress);
      i < ip.toLong(this.lastAddress);
      i++
    ) {
      progress++;
      mainWindow.webContents.send('current-data', JSON.stringify({
        currentHost: ip.fromLong(i),
        progress: progress * 100 / this.hostsLength,
      }));
      const res = await ping.promise.probe(ip.fromLong(i));
      if (res.alive) {
        mainWindow.webContents.send('host-response', JSON.stringify({
          host: res.host,
        }));
      }
    }
    progress = 0;
  }
}

export default Network;