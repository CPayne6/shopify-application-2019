const https = require('https');
var search = require('./searchData.js');
const fileManager = require('./fileIO.js');

module.exports = function(app){
  app.get('/',(req, res) => {
    res.render('index.html');
  });
  app.post('/favourite',(req,res) => {
    var fav = fileManager.toggleFavourite(req.body.id);
    var data;
    console.log(fav);
    if(typeof fav != 'undefined'){
      data = {
        complete: true,
        id: req.body.id,
        favourite: fav
      };
    }
    else{
      data = {complete:false};
    }
    res.send(data);
  });
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