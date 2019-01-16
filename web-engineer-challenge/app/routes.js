const https = require('https');
var search = require('./searchData.js');

module.exports = function(app){
app.get('/',(req, res) => {
    console.log('this was a get request');
    res.render('index.html');
  });
  // req.body.post
  app.post('/search', (req, res) => {
    https.get('https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000', (resp) => {
      let data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        search(res, data, req.body.search);
      });
  
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  });
  
  app.get('*',function (req, res) {
    res.redirect('/');
  });
}