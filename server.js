var express               = require('express');
var app                   = express();
var Webtask               = require('webtask-tools');
var bodyParser            = require('body-parser');
var methodOverride        = require('method-override');
var nodemailer            = require('nodemailer');

"use strict";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

// Define global mail actions:
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'test.carmoov@gmail.com',
    pass: 'technical-difficulty'
  }
});

let sendMail = function(to, giphyUrl, callback) {
  let body = "<img src='" + giphyUrl + "'>";
  let mailOptions = {
    from: "Your Giphy source of fun",
    to: to,
    subject: "You asked for a gif =)",
    html: body
  };

  transporter.sendMail(mailOptions, callback);
};

app.post('/mailmeagif', (req, res) => {
  let giphyBaseUrl = 'http://api.giphy.com/v1/gifs/';
  let giphyApiKey = 's9IFSGbx3LYI2rUvVRPItuAZWAeWSeZ9'
  let emailTest = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  
  if (!req.body.email) {
    res.status(406).json({'error': 'Email undefined'});
  } else if (!emailTest.test(req.body.email)) {
    res.status(406).json({'error': 'Email malformed'});
  } else {
    let url = giphyBaseUrl + 'translate?api_key=' + giphyApiKey + req.body.search ? ('&s=' + req.body.search) : 'random';
    sendMail(req.body.email, url, (err, info) => {
      if (err) {
        res.status(500).send({'error': err});
      } else {
        res.sendStatus(200);
      }
    });
  }
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = Webtask.fromExpress(app);
