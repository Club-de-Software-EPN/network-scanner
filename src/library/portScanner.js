/* eslint-disable @typescript-eslint/no-var-requires */
const EvilScan = require('evilscan');

const scanHost = async (ipAddress) => {
  return new Promise((resolve, reject) => {
    const options = {
      target: ipAddress,
      port: '1-65535',
      banner: true,
    };
    const evilScan = new EvilScan(options);

    evilScan.on('result', resolve)

    evilScan.on('error', reject);
    
    evilScan.run();
  })
}

process.on('message', ({ ipAddress }) => {
  console.log('SOLICITUD DE ESCANEO: ', ipAddress)
  new EvilScan({
    target: ipAddress,
    status:'O',
    port: '1-65535',
    banner: true, 
  }, (err, scan) => {
    scan.on('result', (data) =>  {
      ipAddress === data.ip &&  process.send({ type:`RESPONSE-${ipAddress}`, data})
    });
    scan.on('error', console.error);
    scan.run();
  });
})

process.on('exit', function() {
  process.exit()
})