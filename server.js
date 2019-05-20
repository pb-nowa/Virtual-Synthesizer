const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname)));
app.use("/assets/audio", express.static(__dirname + '/assets/audio'));
app.use("assets//images", express.static(__dirname + '/assets/images'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 8080);