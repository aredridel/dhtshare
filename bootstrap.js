var dht = require('kademlia');

var node = new dht.KNode({ address: process.argv[2], port: parseInt(process.argv[3], 10) });
