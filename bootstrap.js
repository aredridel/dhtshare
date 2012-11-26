var dht = require('kademlia');

var node = new dht.KNode({ address: process.argv[2], port: parseInt(process.argv[3], 10) });

console.log("listening on address", process.argv[2], "and port", process.argv[3]);
