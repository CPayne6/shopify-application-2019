const favouritePhotoActive = 'activeStar.png';
const favouritePhotoInactive = 'inactiveStar.png';
const favouriteNotAvailable = 'unavailableFavourite.png';

var line = document.createElement('div');
line.setAttribute('class','row-space');

var favArr = {};
var searchArr = {};

function generateFavourites(){
    var favContainer = document.getElementsByClassName('favourite-result')[0];
    favContainer.innerHTML = '';
    var keys = Object.keys(favArr);
    if(keys.length > 0){
        keys.forEach(key => {

            var circle = document.createElement('img');
            circle.setAttribute('class','favourite-icon');
            circle.setAttribute('onClick','toggleFavourite("'+key+'");');
            circle.setAttribute('src',favouritePhotoActive);

            var h3 = document.createElement('h3');
            var description = document.createElement('div');                   

            h3.setAttribute('class', 'title');
            h3.innerHTML = favArr[key].title;
            description.innerHTML = favArr[key].description;

            var div = document.createElement('div');
            div.appendChild(circle);
            div.appendChild(h3);
            div.appendChild(description);

            favContainer.appendChild(div);
            favContainer.appendChild(line.cloneNode(false));
        });
    }
    else{
        favContainer.innerHTML = '<h3>Your favourite items will show up here for easy access!</h3>';
    }
}

function analizeInput(text){
    if(text.length == 0){
        document.getElementsByClassName("search-result")[0].innerHTML="<h3>Type in the searchbar above!</h3>";
        searchArr = {};
        favArr = {};
        generateFavourites();
    }
}

function requestData(url) {
    var keyword = document.forms['input'].elements['search'].value;

    if(keyword.length>0){
        postToServer(url,generateSearchResult,'search='+keyword);
    }
    else{
        alert('Please input a keyword in order to search!');
    }
    return false;
}

function postToServer(url,callBack,data){
    $.ajax({
        type: 'POST',
        url:url,
        data: data,
        success:function(data){callBack(data)},
        error:function(jqXHR,textStatus, errorThrown){
            alert("Error, status = " + textStatus + ", " +"error thrown: " + errorThrown);
        },
    });
}

function generateSearchResult(res){
    searchArr = {};

    var container = document.getElementsByClassName('search-result')[0];

    var newContainer = document.createElement('div');
    newContainer.setAttribute('class','search-result');

    res.data.forEach(element => {
        
        //  fill in the values for the title and the cleaned up description

        var h3 = document.createElement('h3');
        var description = document.createElement('div');                   

        h3.setAttribute('class', 'title');
        h3.innerHTML = element.title;
        description.innerHTML = element.description;

        //  create the circe to show if the item is favourited

        var circle = document.createElement('img');
        circle.setAttribute('class','favourite-icon');
        circle.setAttribute('onClick','toggleFavourite(this.id);');

        // if the element does not have an id, use the name to toggle favourite
        if(typeof element.id != 'undefined'){
            circle.setAttribute('id',element.id);
            searchArr[element.id] = element;
        }
        else{
            circle.setAttribute('id',element.title);
            searchArr[element.title] = element;
        }

        if(element.favourite == true){
            circle.setAttribute('src',favouritePhotoActive);
            if(typeof element.id!='undefined'){
                favArr[element.id] = {
                    title:element.title,
                    description:element.description
                };
            }
            else{
                favArr[element.title] = {
                    title:element.title,
                    description:element.description
                };
            }
        }
        else if(element.favourite == false){
            circle.setAttribute('src',favouritePhotoInactive);
        }
        else{
            circle.setAttribute('src',favouriteNotAvailable);
        }

        //  create the span to encompas the title and the favourite icon

        var span = document.createElement('span');
        span.appendChild(circle);
        span.appendChild(h3);

        //  create the two colums that will wrap the span and the description

        var col1 = document.createElement('div');
        var col2 = document.createElement('div'); 

        col1.setAttribute('class','left-column');
        col2.setAttribute('class','right-column');

        col1.appendChild(span);
        col2.appendChild(description);

        //  create row div and fill with children
        
        var row = document.createElement('div');
        row.setAttribute('class','row row-item');
        row.appendChild(col1);
        row.appendChild(col2);

        newContainer.appendChild(row);

        // add row space

        newContainer.appendChild(line.cloneNode(false));
    });

    container.replaceWith(newContainer);
    generateFavourites();
}

function toggleCircle(data){
    console.log(data);
    if(data.complete == true){
        var img = document.getElementById(data.id);
        if(data.favourite == false){
            img.setAttribute('src', favouritePhotoActive);
            favArr[data.id] = {
                title:searchArr[data.id].title,
                description:searchArr[data.id].description
            };
        }
        else{
            img.setAttribute('src', favouritePhotoInactive);
            delete favArr[data.id];
        }
    }
    else{
        alert('sorry, that item cannot be favourited');
    }
    generateFavourites();
}

function toggleFavourite(id){
    postToServer('/favourite',toggleCircle,'id='+id);
}