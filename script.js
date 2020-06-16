const galleryApp = {};

galleryApp.url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
galleryApp.search = 'search';
galleryApp.object = 'objects/'

galleryApp.getInput = () => {
    // get user input, place loading image on page, pass input to ajax call
    const loading = $('<img>').attr('src', './assets/loading.gif');
    const placeholderContainer = $('<div>').addClass('placeholder').html(loading);
    $('.gallery').empty().append(placeholderContainer);
    // create arrays for returned data
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
        // checks if query params return any results, if not, error message
        if (data.objectIDs) {
            // runs second ajax with object IDs from first call to different endpoint
            data.objectIDs.forEach((id) => {
                galleryApp.artObjectArray.push(galleryApp.getArtObjects(id));
            });
            // formats promise to usable array
            $.when(...galleryApp.artObjectArray).then((...artArray) => {
                galleryApp.artInfo = artArray.map((artInfoArray) => {
                    return artInfoArray[0];
                });
                // removes placeholder loading image
                $('.gallery').empty();
                galleryApp.displayThumbnails(galleryApp.artInfo);
            });
        } else {
            const error = $('<h2>').text(`${queryValue} yields no results`)
            $('.placeholder').html(error);
        };
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
    // removes appended items from returned array and creates reference array for caption
    // displays results on page
    galleryApp.splicedArray = resultsArray.splice(0, 20);
    galleryApp.splicedArray.forEach((result) => {
        galleryApp.displayedArray.push(result);
        const objId = result.objectID;
        const image = result.primaryImage;
        const name = result.objectName;
        const title = result.title;
        const img = $('<img>').attr({ 'src': image, 'alt': `${title}, ${name}`, 'id': `image${objId}`}).addClass('galleryImage');
        const imageContainer = $('<button>').addClass('galleryThumbnail').attr('id', objId).html(img);
        $('.gallery').append(imageContainer); 
    });
    // checks results array to see if more items need to be added
    if (resultsArray.length > 0) {
        const showMoreClass = "fas fa-chevron-down"
        const showMore = $('<i>').addClass(showMoreClass);
        const showMoreButton = $('<button>').addClass('showMore').val("Show more").html(showMore);
        $('.gallery').append(showMoreButton);
    };
};

galleryApp.displayLarger = (idNumber) => {
    // displays larger image in highlight container
    galleryApp.displayedArray.forEach((displayedObject) => {
        if (idNumber == displayedObject.objectID) {
        const obj = {
            objId: displayedObject.objectID,
            medium: displayedObject.medium,
            date: displayedObject.objectDate,
            name: displayedObject.objectName,
            image: displayedObject.primaryImage,
            title: displayedObject.title,
            artist: displayedObject.artistDisplayName
        };
        for (variable in obj) {
            // error handling for undefined fields returned from ajax call
            if (!obj[variable]) {
                obj[variable] = `${variable} unknown`
            }
        };
        const info = `fas fa-info-circle`;
        const img = $('<img>').attr({'src': obj.image, 'alt': `${obj.title}, ${obj.name}`})
        const imageContainer = $('<div>').addClass('highlight__container').html(img);
        const icon = $('<i>').addClass(info).attr('id', 'icon');
        const infoButton = $('<button>').val(obj.objId).addClass('infoButton').html(icon);
        const title = $('<p>').text(obj.title);
        const artist = $('<p>').text(obj.artist);
        const date = $('<p>').text(obj.date);
        const name = $('<p>').text(obj.name);
        const medium = $('<p>').text(obj.medium);

        const description = $('<div>').addClass('caption').append(title, artist, date, medium, name);
        $('.highlight').empty().append(imageContainer, infoButton, description);
        };
    });
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
        $('#icon').toggleClass('fa-times-circle fa-info-circle');
        $('.caption').slideToggle();
    });
};

$(function() {
    galleryApp.init();
});