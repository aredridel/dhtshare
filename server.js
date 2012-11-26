var express = require('express');

var dht = require('kademlia');

var config = require('./config.json');

var os = require('os');


var nodes = [];
var node;
var interfaces = os.networkInterfaces();

for (var idx in interfaces) {
    for (var x in interfaces[idx]) {
        if (interfaces[idx][x].family != 'IPv4') continue;
        console.log(interfaces[idx][x]);
        createNode(interfaces[idx][x].address);
    }
}

function createNode(address) {
    nodes.push(node = new dht.KNode({ address: address, port: 12346 }));
    for (var i in config.bootnodes) {
        node.connect(config.bootnodes[i].address, config.bootnodes[i].port, onConnected);
    }
}

var connected = false;

function onConnected() {
    if (connected) return;

    console.log('connected');
    connected = true;
}

var app = express();

app.use(app.router);

app.get('/*', function(req, res) {
    node.get(req.params[0], function(err, value) {
        if (err) {
            res.statusCode = (err.code == 'NOTFOUND' ? 404 : 500);
            res.send(JSON.stringify(err));
        } else {
            res.send(value);
        }
    });
});

app.put('/*', function(req, res) {
    var d = '';
    req.on('data', function(data) {
        d += data;
    });
    req.on('end', function() {
        node.set(req.params[0], d, function(err) {
            if (err) {
                res.statusCode = (err.code == 'NOTFOUND' ? 404 : 500);
                res.send(JSON.stringify(err));
            } else {
                res.send(d);
            }
        });
    });
});

app.listen(12121);
