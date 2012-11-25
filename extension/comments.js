(function() {
    var url = document.location.toString();
    console.log('hello,', url);

    function get(callback) {
        var req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:12121/' + url, true);

        req.onreadystatechange = function (oEvent) {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    callback(null, req.responseText);
                } else {
                    callback(req.statusText);
                }
            }
        };

        req.send();
    }

    function put(message, callback) {
        var req = new XMLHttpRequest();
        req.open('PUT', 'http://localhost:12121/' + url, true);

        req.onreadystatechange = function (oEvent) {
            if (req.status === 200) {
                callback(null, req.responseText);
            } else {
                callback(req.statusText);
            }
        };

        req.send(message);
    }

    window.addEventListener("message", function(event) {
        // We only accept messages from ourselves
        if (event.source != window) return;

        if (event.data.type && (event.data.type == "COMMENT")) {
            put(event.data.text, function(err, data) {
                console.log(data);
                get(function(err, data) {
                   console.log(data);
                });
            });
        }
    }, false);

    get(function(err, data) {
       console.log(data);
    });

})();
