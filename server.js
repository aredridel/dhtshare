var express = require('express');

var dht = require('kademlia');

var node = new dht.KNode({ address: process.argv[2], port: parseInt(process.argv[3], 10) });

node.connect('127.0.0.1', 12345, function() {
    console.log('connected');

    var app = express();

    app.use(app.router);

    app.get('/*', function(req, res) {
        node.get(req.params[0], function(err, value) {
            if (err) console.log(err);
            res.send(value);
        });
    });

    app.put('/*', function(req, res) {
        var d = '';
        req.on('data', function(data) {
            d += data;
        });
        req.on('end', function() {
            node.set(req.params[0], d, function(err) {
                if (err) console.log(err);
                res.send(d);
            });
        });
    });

    app.listen(12121);
});
