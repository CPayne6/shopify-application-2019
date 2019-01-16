const fs = require('fs');

module.exports = (res, data, keyword) => {
    console.log(keyword);
    data = JSON.parse(data);
    res.send(getItems(keyword, data));
  }

  function getItems(keyword, data){
      var retObj = [];
      data.forEach(element => {
          if(element.keywords.indexOf(keyword) != -1){
            var temp = {
                    title: element.title,
                    description: cleanupDescription(element.body),
                    favourite: isFavourite(element.id)
                }
            retObj.push(temp);
          }
      });
      console.log(retObj);
      return {data: retObj};
  }

  function cleanupDescription(text){
    const regexArray =  [/&lt;/gm, /&gt;/gm, /nbsp;/gm, /&amp;/gm] ; 
    const regexReplaceVal = ['<', '>', ' ', ''];
    for(var i=0; i<regexArray.length;i++){
        text = text.replace(regexArray[i], regexReplaceVal[i]);
    }
    return text;
  }

  function isFavourite(id){
    var obj = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    if(obj.favourites.indexOf(id) > 0){
        return true;
    }
    return false;
  }