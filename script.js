const galleryApp = {};

galleryApp.url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
galleryApp.search = 'search';
galleryApp.object = 'objects/'

galleryApp.getInput = () => {
    $('.gallery').empty();
    galleryApp.artObjectArray = [];
    galleryApp.displayedArray = [];
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
            galleryApp.artInfo = artArray.map((artInfoArray) => {
                return artInfoArray[0];
            });
            galleryApp.displayThumbnails(galleryApp.artInfo);
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
    galleryApp.splicedArray = resultsArray.splice(0, 20);
    galleryApp.splicedArray.forEach((result) => {
        galleryApp.displayedArray.push(result);
        const objId = result.objectID;
        const image = result.primaryImage;
        const name = result.objectName;
        const title = result.title;
        const img = $('<img>').attr({ 'src': image, 'alt': `${title}, ${name}`, 'id': `image${objId}`}).addClass('galleryImage');
        const imageContainer = $('<div>').addClass('galleryThumbnail').attr('id', objId).html(img);
        $('.gallery').append(imageContainer); 
    });
    if (resultsArray.length > 0) {
        const showMore = $('<button>').addClass('showMore').text('more');
        $('.gallery').append(showMore);
    };
};

galleryApp.displayLarger = (idNumber) => {
    galleryApp.displayedArray.forEach((displayedObject) => {
        if (idNumber == displayedObject.objectID) {
        const objId = displayedObject.objectID;
        const medium = displayedObject.medium;
        const date = displayedObject.objectDate;
        const name = displayedObject.objectName;
        const image = displayedObject.primaryImage;
        const title = displayedObject.title;
        const artist = displayedObject.artistDisplayName;
        const info = `fas fa-info-circle`;
        const img = $('<img>').attr({'src': image, 'alt': `${title}, ${name}`})
        const imageContainer = $('<div>').addClass('highlight__container').html(img);
        const icon = $('<i>').addClass(info);
        const infoButton = $('<button>').val(objId).addClass('infoButton').html(icon);
        let captionContent;
        if (artist) {
            captionContent = $('<p>').text(title, artist, medium, date, name);
        } else {
            captionContent = $('<p>').append(title, medium, date, name);
        };
        const description = $('<div>').addClass('caption').html(captionContent);
        $('.highlight').empty().append(imageContainer, infoButton, description);
        };
    });
};
// galleryApp.toggleInfo = (iconId) => {
//     console.log(iconId);
// };

galleryApp.init = () => {
    $('form').on('submit', function(e) {
        e.preventDefault();
        galleryApp.getInput();
    });
    $('.gallery').on('click', '.showMore', function(e) {
        e.preventDefault();
        $(this).toggle();
        galleryApp.displayThumbnails(galleryApp.artInfo);
    });
    $('.gallery').on('click', '.galleryThumbnail', function() {
        galleryApp.displayLarger($(this).attr('id'));
    });
    $('.highlight').on('click', '.infoButton', function(e) {
        e.preventDefault();
        $('.fas').toggleClass('fa-times-circle fa-info-circle');
        $('.caption').toggle();
    });
};

$(function() {
    galleryApp.init();
});