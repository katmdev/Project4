const galleryApp = {};

galleryApp.url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
galleryApp.search = 'search';
galleryApp.object = 'objects/'

galleryApp.getInput = () => {
    const userInput = $('input[name=search]').val();
    galleryApp.getArtIds(userInput);
    console.log(userInput);
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
        artObjectArray = [];
        data.objectIDs.forEach((id) => {
            artObjectArray.push(galleryApp.getArtObjects(id));
        })
        console.log(artObjectArray);
    });
};
galleryApp.getArtObjects = (objectEndpoint) => {
    $.ajax({
        url: `${galleryApp.url}${galleryApp.object}${objectEndpoint}`,
        method: 'GET',
        dataType: 'json'
    }).then((data) => {
        return(data);
    });
};
galleryApp.displayThumbnails = () => {};
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
    $('.galleryThumbnail').on('click', function() {

    });
    $('.info').on('click', function() {

    });
};

$(function() {
    galleryApp.init();
});