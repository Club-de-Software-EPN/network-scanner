/* eslint-disable @typescript-eslint/no-var-requires */
const EvilScan = require('evilscan');

process.on('message', ({ ipAddress }) => {
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