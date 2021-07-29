/* eslint-disable @typescript-eslint/no-var-requires */
const ip = require('ip');
const ping = require('ping');

const pingHost = async (ipAddress) => {
  const pingResponse = await ping.promise.probe(ipAddress);
  if (pingResponse.alive) {
    process.send({type: 'ALIVE', data: { ipAddress }})
  }
}

process.on('message', async ({ firstAddress, lastAddress, hostsLength }) => {
  let progress = 0;
  for (
    let i = ip.toLong(firstAddress);
    i < ip.toLong(lastAddress);
    i++
  ) {
    progress++;
    process.send({ type: 'INFO', data: { ipAddress: ip.fromLong(i), progress: progress * 100 / hostsLength, } })
    await pingHost(ip.fromLong(i));
  }
});


process.on('exit', function() {
  process.exit()
})
