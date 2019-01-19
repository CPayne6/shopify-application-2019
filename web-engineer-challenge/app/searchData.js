const fileManager = require('./fileIO.js');

module.exports = (res, data, keyword) => {
    data = JSON.parse(data);
    res.send(getItems(keyword, data));
  }

  function getItems(keyword, data){
      var retObj = [];
      var regex = new RegExp('[^\w\s]'+keyword.trim()+'[^\w\s]','mi');

      data.forEach(element => {
          if(element.keywords.search(regex) != -1){
            var lookup;
            if(typeof element.id == 'undefined'){
                lookup = element.title;
            }
            else{
                lookup = element.id;
            }
            var temp = {
                    title: element.title,
                    description: cleanupDescription(element.body),
                    favourite: fileManager.isFavourite(lookup),
                    id: element.id
                }
            retObj.push(temp);
          }
      });
      return {data: retObj};
  }

  function cleanupDescription(text){
    const regexArray =  [/&lt;\/a.*&gt;/gm,/&lt;a.*&gt;/gm,/&lt;/gm, /&gt;/gm, /nbsp;/gm, /&amp;/gm] ; 
    const regexReplaceVal = [' ',' ','<', '>', ' ', ''];
    for(var i=0; i<regexArray.length;i++){
        text = text.replace(regexArray[i], regexReplaceVal[i]);
    }
    return text;
  }