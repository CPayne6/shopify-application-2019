const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/res'));

require("./app/routes.js")(app);

app.listen(port, () => console.log(`Listening on port ${port}`));