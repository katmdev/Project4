const galleryApp = {};

galleryApp.url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
galleryApp.search = 'search';
galleryApp.object = 'objects/'

galleryApp.getInput = () => {
    galleryApp.artObjectArray = [];
    const userInput = $('input[name=search]').val();
    galleryApp.getArtIds(userInput);
};
galleryApp.getArtIds = (queryValue) => {
    $.ajax({
        url: `${galleryApp.url}${galleryApp.search}`,
        method: 'GET',
        dataType: 'json',
        data: {
            isHighlight: true,
            q: queryValue
        }
    }).then((data) => {
        data.objectIDs.forEach((id) => {
            galleryApp.artObjectArray.push(galleryApp.getArtObjects(id));
        });
        $.when(...galleryApp.artObjectArray).then((...artArray) => {
            const artInfo = artArray.map((artInfoArray) => {
                return artInfoArray[0];
            });
            galleryApp.displayThumbnails(artInfo);
        });
    });
};
galleryApp.getArtObjects = (objectEndpoint) => {
    return $.ajax({
        url: `${galleryApp.url}${galleryApp.object}${objectEndpoint}`,
        method: 'GET',
        dataType: 'json'
    });
};

galleryApp.displayThumbnails = (resultsArray) => {
    console.log(resultsArray);
    $('.gallery').empty();
    resultsArray.forEach((result) => {
        const objId = result.objectID;
        const thumbnail = result.primaryImageSmall;
        const image = result.primaryImage;
        const medium = result.medium;
        const date = result.objectDate;
        const name = result.objectName;
        const title = result.title;
        const artist = result.artistDisplayName;
        // error handling for variables that have empty string "unknown"
        console.log(objId, thumbnail, image, medium, date, name, title, artist);
        const img = $('<img>').attr({'src': thumbnail, 'alt': title})
        const imageContainer = $('<div>').addClass('galleryThumbnail').attr('id', objId).html(img);
        $('.gallery').append(imageContainer);
    });


    // append thumbnails from primaryImageSmall
    // assign ID = objectID
    // think about pagenation when displaying the thumbnails
};
galleryApp.addMoreResults = () => {};
galleryApp.toggleInfo = () => {};
galleryApp.displayLarger = () => {};

galleryApp.init = () => {
    $('form').on('submit', function(e) {
        e.preventDefault();
        galleryApp.getInput();
    });
    $('#moreResults').on('click', function() {

    });
    $('.gallery').on('click', '.galleryThumbnail', function() {

    });
    $('.info').on('click', function() {

    });
};

$(function() {
    galleryApp.init();
});