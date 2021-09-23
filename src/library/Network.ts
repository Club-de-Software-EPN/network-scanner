import ip from 'ip';
import { IpcMainEvent } from 'electron';
import { fork, ChildProcess } from 'child_process';
import path from 'path';

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

const PING_WORKER_PATH = path.resolve(__dirname, 'ping.js');
const PORT_SCANNER_WORKER_PATH = path.resolve(__dirname, 'portScanner.js');
class Network {
  private ipAddress: string;
  private netMask: string;
  private CIDR: number;
  private networkAddress: string;
  private firstAddress: string;
  private lastAddress: string;
  private hostsLength: number;
  private eventHandler: IpcMainEvent;
  private pingWorker: ChildProcess;
  private portScannerWorker: ChildProcess;

  constructor(eventHandler: IpcMainEvent = null, ipAddress= ip.address(), netMask = "255.255.255.0", CIDR= 24) {
    this.pingWorker = fork(PING_WORKER_PATH);
    this.portScannerWorker = fork(PORT_SCANNER_WORKER_PATH);
    this.eventHandler = eventHandler;
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

  setEventHandler(eventHandler: IpcMainEvent): void {
    this.eventHandler = eventHandler;
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

  discover (): void {
    console.log(this.pingWorker)
    if ( this.pingWorker && this.portScannerWorker || this.pingWorker.killed && this.portScannerWorker.killed) {
      this.reactiveChildProcesses();
    }
    console.log(this.pingWorker)

    this.pingWorker.send({ firstAddress: this.firstAddress, lastAddress: this.lastAddress, hostsLength: this.hostsLength });
    this.pingWorker.on('message', ({ type, data }: any) => {
      if ( type === 'INFO' ) {
        this.eventHandler.reply('current-data', JSON.stringify({
          currentHost: data.ipAddress,
          progress: data.progress,
        }));
      }

      if ( type === 'ALIVE' ) {
        this.eventHandler.reply('host-response', JSON.stringify({
          host: data.ipAddress,
        }));
      }
    });
  }

  scan (ipAddress: string): void {
    this.portScannerWorker.send({ ipAddress: ipAddress });
    this.portScannerWorker.on('message', ({data, type}: any) => {
      if (type === `RESPONSE-${ipAddress}`) {
        this.eventHandler.reply('scanned-host', JSON.stringify(data));
      }
    });
  }

  killChildProcesses(): void {
    if (this.pingWorker || this.portScannerWorker) {
      this.pingWorker.kill('SIGINT');
      this.portScannerWorker.kill('SIGINT');
    }
    delete this.pingWorker;
    delete this.portScannerWorker;
  }

  reactiveChildProcesses(): void {
    this.killChildProcesses();
    this.pingWorker = fork(PING_WORKER_PATH);
    this.portScannerWorker = fork(PORT_SCANNER_WORKER_PATH);
  }
}

export default Network;