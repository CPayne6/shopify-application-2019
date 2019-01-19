const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.use(bodyParser.urlencoded({ extended: true }));
 


app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/res'));

require("./app/routes.js")(app);

app.listen(server_port, server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
  });