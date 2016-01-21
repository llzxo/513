/**
 * Created by llzxo on 2016/1/21.
 */
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var REQUESTS_FILE = path.join(__dirname, 'requests.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/requests', function(req, res) {
    fs.readFile(REQUESTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(JSON.parse(data));
    });
});

app.post('/api/requests', function(req, res) {
    fs.readFile(REQUESTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var requests = JSON.parse(data);
        // NOTE: In a real implementation, we would likely rely on a database or
        // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
        // treat Date.now() as unique-enough for our purposes.
        var newComment = {
            id: Date.now(),
            author: req.body.author,
            text: req.body.text,
        };
        requests.push(newComment);
        fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 4), function(err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.setHeader('Cache-Control', 'no-cache');
            res.json(requests);
        });
    });
});


app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});