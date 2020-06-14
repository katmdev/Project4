const galleryApp = {};

galleryApp.url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
galleryApp.search = 'search';
galleryApp.object = 'objects/'

galleryApp.getInput = () => {
    $('.gallery').empty();
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
    console.log(galleryApp.splicedArray);
    galleryApp.splicedArray.forEach((result) => {
        const objId = result.objectID;
        const thumbnail = result.primaryImageSmall;
        const name = result.objectName;
        const title = result.title;
        const img = $('<img>').attr({'src': thumbnail, 'alt': `${title}, ${name}`})
        const imageContainer = $('<div>').addClass('galleryThumbnail').attr('id', objId).html(img);
        $('.gallery').append(imageContainer);
    });
    if (resultsArray.length > 0) {
        const showMore = $('<button>').addClass('showMore').text('more');
        $('.gallery').append(showMore);
    };
};

galleryApp.displayLarger = (idNumber) => {
    galleryApp.splicedArray.forEach((splicedObject) => {
        if (idNumber == splicedObject.objectID) {
        const objId = splicedObject.objectID;
        const medium = splicedObject.medium;
        const date = splicedObject.objectDate;
        const name = splicedObject.objectName;
        const image = splicedObject.primaryImage;
        const title = splicedObject.title;
        const artist = splicedObject.artistDisplayName;
        const info = `fas fa-info-circle`;
        const img = $('<img>').attr({'src': image, 'alt': `${title}, ${name}`})
        const imageContainer = $('<figure>').addClass('highlightImage').html(img);
        const icon = $('<i>').addClass(info);
        const infoButton = $('<button>').val(objId).addClass('infoButton').html(icon);
        let captionContent;
        if (artist) {
            captionContent = $('<p>').text(title, artist, medium, date, name);
        } else {
            captionContent = $('<p>').append(title, medium, date, name);
        };
        const description = $('<figcaption>').addClass('caption').html(captionContent);
        $('.highlight').empty().append(imageContainer, infoButton, description);
        };
    });
};
galleryApp.toggleInfo = (iconId) => {
    console.log(iconId);
};

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