const fs = require('fs');
const fileName = './db/db.json';

module.exports = {

    isFavourite:(lookup,obj) => {
        return isFavouriteNative(lookup,obj);
    },

    toggleFavourite:(lookup) => {
        var obj = getFile();
        var checkFavourite = isFavouriteNative(lookup,obj);

        if(checkFavourite == true){
            var i = obj.favourites.indexOf(lookup);
            if(i > -1){
                obj.favourites.splice(i,1);
            }
        }
        else{
            obj.favourites.push(lookup);
        }
        if(writeFile(obj)){
            return checkFavourite;
        }
    }

}

function getFile(){
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

function writeFile(fileData){
    try{
        fs.writeFileSync(fileName, JSON.stringify(fileData));
        return true;
    }
    catch(e){
        return false;
    }
}

function isFavouriteNative(lookup,obj){
    if(typeof obj == 'undefined'){obj = getFile()};
    if(obj.favourites.indexOf(lookup) > -1){
        return true;
    }

    return false;
}