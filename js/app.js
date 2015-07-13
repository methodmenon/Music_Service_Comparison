$(document).ready(function() {
    $('#run_app').submit(function(event) {
        var artist = $(this).find("input[name='artist_choice']").val();
        console.log((artist) == "");
        if (artist == "") {
            alert("You Must Enter an Artist");
            location.reload();
        }
        // $('.result_elements').html('');
        $('#results_container').hide();
        $('#results_container').html('');
        $('.loading').css("display", "block");
        // $('.spinner').css("display", "block");
        getArtistBasedComparison(artist);
    });

    $('.home_nav').click(function(e) {
        location.reload();
    });

    $('.about_nav').click(function(e) {
        e.preventDefault(e);
        $('#blurb').css("display", "none");
        $('#instructions').css("display", "none");
        $("#artist_choice_container").css("display", "none");
        $("#service_selections").css("display", "none");
        $("#comparison_container").css("display", "none");
        $("#compare_button_container").css("display", "none");
        $('#about').fadeIn(1000);
    });

    $('.instructions_nav').click(function(e) {
        e.preventDefault(e);
        $('#blurb').css("display", "none");
        $('#about').css("display", "none");
        $("#artist_choice_container").css("display", "none");
        $("#service_selections").css("display", "none");
        $("#comparison_container").css("display", "none");
        $("#compare_button_container").css("display", "none");
        $('#instructions').fadeIn(1000);
    });
});

//in following function is for getting the artist id from spotify
//by typing the artist name in the "artist" input box
var savedArtistId;

var albumNames = [];
var topTracks = [];

//a counter variable for helping to calculate how long the loading animation should run
var completedAjaxCalls = 0;

//function for making sure 2 ajax calls have occured before hiding our loading screen
var checkCompletedData = function() {
    completedAjaxCalls++;
    if (completedAjaxCalls == 2) {
        //hide the loading screen elements
        $('.loading').css("display", "none");
        //show the results container
        $('#results_container').show();
        //reset the compltedAjaxCalls variable
        completedAjaxCalls = 0;
    }
};

var getArtistBasedComparison = function(artist) {
    var serviceChoiceOne = $('#service_one_container').find(':selected').text();
    var serviceChoiceTwo = $('#service_two_container').find(':selected').text();
    var comparisonCriteria = $('#comparison_choice').find(':selected').text();
    console.log(serviceChoiceOne);

    //serviceOne
    if (serviceChoiceOne == "Spotify") {
        //$('#service_choice_one_name').text("Spotify");
        getSpotifyArtistData(artist, comparisonCriteria); //not yet defined

    }

    else if (serviceChoiceOne == "Last.FM") {
        //$('#service_choice_two_name').text("Last FM");
        if (comparisonCriteria == "Albums") {
            getArtistAlbumsLastFM(artist, serviceChoiceOne);
        }
        else if (comparisonCriteria == "Top Tracks") {
            getArtistTopTracksLastFM(artist, serviceChoiceOne);
        }
        else {
            comingSoon(serviceChoiceOne, comparisonCriteria);
        }
    }

    else if (serviceChoiceOne == "iTunes") {
        //$('#service_choice_two_name').text("iTunes");
        if (comparisonCriteria == "Albums") {
            getItunesArtistAlbums(artist, serviceChoiceOne);
        }
        else if (comparisonCriteria == "Top Tracks") {
            getItunesArtistTopTracks(artist, serviceChoiceOne);
        }
        else {
            comingSoon(serviceChoiceOne, comparisonCriteria);
        }
    }

    else if (serviceChoiceOne == "Option 1") {
        optionMessage(serviceChoiceOne);
    }

    else {
        comingSoon(serviceChoiceOne);
    }

    //serviceTwo
    if (serviceChoiceTwo == "Spotify") {
        //$('#service_choice_one_name').text("Spotify");
        getSpotifyArtistData(artist, comparisonCriteria); //not yet defined

    }

    else if (serviceChoiceTwo == "Last.FM") {
        //$('#service_choice_two_name').text("Last FM");
        if (comparisonCriteria == "Albums") {
            getArtistAlbumsLastFM(artist, serviceChoiceTwo);
        }
        else if (comparisonCriteria == "Top Tracks") {
            getArtistTopTracksLastFM(artist, serviceChoiceTwo);
        }
        else {
            comingSoon(serviceChoiceTwo, comparisonCriteria);
        }
    }

    else if (serviceChoiceTwo == "iTunes") {
        //$('#service_choice_two_name').text("iTunes");
        if (comparisonCriteria == "Albums") {
            getItunesArtistAlbums(artist, serviceChoiceTwo);
        }
        else if (comparisonCriteria == "Top Tracks") {
            getItunesArtistTopTracks(artist, serviceChoiceTwo);
        }
        else {
            comingSoon(serviceChoiceTwo, comparisonCriteria);
        }
    }

    else if (serviceChoiceTwo == "Option 2") {
        optionMessage(serviceChoiceTwo);
    }



    else {
        comingSoon(serviceChoiceTwo);
    }
};

var getSpotifyArtistData = function(artist, comparisonCriteria) {
    var serviceChoice = "Spotify";

    var data = {
        q:"{%s}".replace('{%s}', artist),
        type: 'artist'
    };


    var url = "https://api.spotify.com/v1/search/";

    var response = $.ajax({
        url: url,
        data: data,
        dataType: "json",
        type: "GET",
    })
    .done(function(response) {
            console.log(response.artists.items.length);
            if (response.artists.items.length != 0) {
                savedArtistId = response.artists.items[0].id;
                //save artist id to designated element
                var artist_name = response.artists.items[0].name;
                //capitalize first letter of artist name
                var artist_name = artist_name.charAt(0).toUpperCase() + artist_name.substring(1);

                var artist_id = response.artists.items[0].id;
        
                if (comparisonCriteria == 'Albums') {
                    getArtistAlbumsSpotify(artist_name, savedArtistId);
                }
                else if (comparisonCriteria == 'Top Tracks') {
                    getArtistTopTracksSpotify(artist_name, savedArtistId);
                }
                else {
                    comingSoon(serviceChoice, comparisonCriteria);
                }
             }
            else {
                searchError(serviceChoice);
            }
        });
};

var getArtistAlbumsSpotify = function(artist_name, artist_id) {

    //make sure albumName dictionary is clear of all elements

    //endpoint for getting an Artists's albums 
    //GET https://api.spotify.com/v1/artists/{id}/albums?album_type=album
    //console.log(artist_id == undefined);
    var url = "https://api.spotify.com/v1/artists/{%s}/albums".replace("{%s}", artist_id);

    var data = {
        album_type: "album"
    };

    var response = $.ajax({
        url: url,
        data: data,
        //no need for headers since data is already specified in the 'dataType' parameter
        dataType: "json",
        type: "GET",
    })
    .done(function(response) {
        //clone service result container
        var result_container = $('.templates .results').clone();
        //append data to the relevant tags
        var service_choice_name = result_container.find('.result_title');
        service_choice_name.text("Spotify");
        var results_artist_name = result_container.find('.result_artist');
        results_artist_name.text(artist_name);
        var results_criteria = result_container.find('.comparison_title');
        results_criteria.text("Album List");
        var service_choice_results = result_container.find('.result_elements');


        albumNames = [];
        $.each(response.items, function(i, item) {
            if (jQuery.inArray(item.name, albumNames) == -1) {
                albumNames.push(item.name);
                console.log(item.name);
                var albumName = showAlbumName(item.name);
                service_choice_results.append(albumName);
            }
        });
        //show loading screen until both calls are made
        checkCompletedData();
        $('#results_container').append(result_container);
    });
};

var getArtistTopTracksSpotify = function(artist_name, artist_id) {

    //GET https://api.spotify.com/v1/artists/{id}/top-tracks?country={country_code}
    //where country code is required
    var url = "https://api.spotify.com/v1/artists/{%s}/top-tracks".replace("{%s}", artist_id);

    //right now make country code US
    //for future, make this default, and allow for user to change the country code
    var data = {
        country: "US"
    }

    var response = $.ajax({
        url: url,
        data: data,
        dataType: "json",
        type: "GET",
    })
    .done(function(response) {
        var result_container = $('.templates .results').clone();
        //append data to the relevant tags
        var service_choice_name = result_container.find('.result_title');
        service_choice_name.text("Spotify");
        var results_artist_name = result_container.find('.result_artist');
        results_artist_name.text(artist_name);
        var results_criteria = result_container.find('.comparison_title');
        results_criteria.text("Top Tracks for Artist");
        var service_choice_results = result_container.find('.result_elements');
        topTracks = [];
        $.each(response.tracks, function(i, track) {
            if (jQuery.inArray(track.name, topTracks) == -1) {
                topTracks.push(track.name);
                var topTrackName = showTopTrackName(track.name);
                service_choice_results.append(topTrackName);
            }
        });
        //show loading screen until both calls are made
        checkCompletedData();
        $('#results_container').append(result_container);
    });
    
};

//LAST FM FUNCTIONS
var getArtistAlbumsLastFM = function(artist, serviceChoice) {
    albumNames = [];
    //example url: http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=cher&api_key=ff3e25961bae73b5ac8ee08b4d1a93e7&format=json

    //CANNOT MAKE API_KEY PRIVATE --> since js is frontend
    var myAPI_Key = "d158e6a6584a59316cd8b0816738f10e";

    var serviceChoice = "{%s}".replace("{%s}", serviceChoice);

    var url = "http://ws.audioscrobbler.com/2.0";
    var thisArtist = "{%s}".replace("{%s}", artist);
    //capitalize the artist name
    var artist_name = artist.charAt(0).toUpperCase() + artist.substring(1);

    var data = {
        method: "artist.gettopalbums",
        artist: thisArtist,
        api_key: myAPI_Key,
        format: "json",
    };

    var response = $.ajax({
        url: url,
        data: data,
        dataType: "json",
        type: "GET"
    })
    .done(function(response) {
        if (response.topalbums != undefined) {
            var result_container = $('.templates .results').clone();
            //append data to the relevant tags
            var service_choice_name = result_container.find('.result_title');
            service_choice_name.text("Last FM");
            var results_artist_name = result_container.find('.result_artist');
            results_artist_name.text(artist_name);
            var results_criteria = result_container.find('.comparison_title');
            results_criteria.text("Album List");
            var service_choice_results = result_container.find('.result_elements');
            $.each(response.topalbums.album, function(i, album) {
                if (jQuery.inArray(album.name, albumNames) == -1) {
                    albumNames.push(album.name);
                    var albumName = showAlbumName(album.name);
                    service_choice_results.append(albumName);
                }
            });
        }
        else {
                searchError(serviceChoice);
        }
        //show loading screen until both calls are made
        checkCompletedData();
        $('#results_container').append(result_container);
    });
};

var getArtistTopTracksLastFM = function(artist, serviceChoice) {
    topTracks = [];

    //endpoint for getting Artist's top tracks
    //http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=cher&api_key=d158e6a6584a59316cd8b0816738f10e&format=json

    //NEED TO MAKE myAPI_Key private
    var myAPI_Key = "d158e6a6584a59316cd8b0816738f10e";

    var serviceChoice = "{%s}".replace("{%s}", serviceChoice);

    var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=cher&api_key=d158e6a6584a59316cd8b0816738f10e&format=json"
    var thisArtist = "{%s}".replace("{%s}", artist);
    //capitalize first letter of artist name
    var artist_name = artist.charAt(0).toUpperCase() + artist.substring(1);

    var data = {
        method: "artist.gettoptracks",
        artist: thisArtist, 
        api_key: myAPI_Key,
        format: "json",
    };

    var response = $.ajax({
        url: url,
        data: data,
        dataType: "json",
        type: "GET",
    })
    .done(function(response) {
        //console.log(response);
        console.log(response.toptracks == undefined);
        if (response.toptracks != undefined) {
            var result_container = $('.templates .results').clone();
            //append data to the relevant tags
            var service_choice_name = result_container.find('.result_title');
            service_choice_name.text("Last FM");
            var results_artist_name = result_container.find('.result_artist');
            results_artist_name.text(artist_name);
            var results_criteria = result_container.find('.comparison_title');
            results_criteria.text("Top Tracks for Artist");
            var service_choice_results = result_container.find('.result_elements');
            $.each(response.toptracks.track, function(i, track) {
                if (jQuery.inArray(track.name, topTracks) == -1) {
                    topTracks.push(track.name);
                    var topTrackName = showTopTrackName(track.name);
                    service_choice_results.append(topTrackName);
                }
            });
        }
        else {
            searchError(serviceChoice);
        }
        
        //show loading screen until both calls are made
        checkCompletedData();
        $('#results_container').append(result_container);
    });

};

//ITUNES FUNCTIONS
//itunes fully-qualified url--> https://itunes.apple.com/search?parameterkeyvalue
var getItunesArtistAlbums = function(artist, serviceChoice) {
    //ex: https://itunes.apple.com/search?term=jack+johnson&entity=album&sort=popular
    var serviceChoice = "{%s}".replace("{%s}", serviceChoice);
    albumNames = [];

    var url = "https://itunes.apple.com/search";
    var thisArtist = "{%s}".replace("{%s}", artist);
    //capitalize first letter of artist
    console.log(artist);
    console.log(thisArtist);
    var artist_name = artist.charAt(0).toUpperCase() + artist.substring(1);

    var data = {
        term: thisArtist,
        entity: "album",
        sort: "popular",
        //limit: 20
    };

    var response = $.ajax({
        url: url,
        data: data,
        dataType: "jsonp",
        type: "GET"
    })
    .done(function(response){
        //console.log(response);
        //console.log(response.resultCount == 0);
        if (response.resultCount != 0) {
            var result_container = $('.templates .results').clone();
            //append data to the relevant tags
            var service_choice_name = result_container.find('.result_title');
            service_choice_name.text("iTunes");
            var results_artist_name = result_container.find('.result_artist');
            results_artist_name.text(artist_name);
            var results_criteria = result_container.find('.comparison_title');
            results_criteria.text("Album List");
            var service_choice_results = result_container.find('.result_elements');
            $.each(response.results, function(i, result) {
                if (jQuery.inArray(result.collectionName, albumNames) == -1) {
                    albumNames.push(result.collectionName);
                    var albumName = showAlbumName(result.collectionName);
                    service_choice_results.append(albumName);
                }
            });
        //show loading screen until both calls are made
            checkCompletedData();
            $('#results_container').append(result_container);
        }
        else {
            searchError(serviceChoice);
        }
    });

};

var getItunesArtistTopTracks = function(artist, serviceChoice) {
    //ex: https://itunes.apple.com/search?term=jack+johnson&entity=song&sort=popular
    var serviceChoice = "{%s}".replace("{%s}", serviceChoice);
    toptracks = [];

    var url = "https://itunes.apple.com/search";
    var thisArtist = "{%s}".replace("{%s}", artist);
    //capitalize first letter of artist
    var artist_name = artist.charAt(0).toUpperCase() + artist.substring(1);

    var data = {
        term: thisArtist,
        entity: "song",
        sort: "popular"
    };

    var response = $.ajax({
        url: url,
        data: data,
        dataType: "jsonp",
        response: "GET"
    })
    .done(function(response) {
        //console.log(response);
        //console.log(response.resultCount);
        if (response.resultCount != 0) {
            var result_container = $('.templates .results').clone();
            //append data to the relevant tags
            var service_choice_name = result_container.find('.result_title');
            service_choice_name.text("iTunes");
            var results_artist_name = result_container.find('.result_artist');
            results_artist_name.text(artist_name);
            var results_criteria = result_container.find('.comparison_title');
            results_criteria.text("Top Tracks for Artist");
            var service_choice_results = result_container.find('.result_elements');
            $.each(response.results, function(i, track) {
                if (jQuery.inArray(track.trackName, topTracks) == -1) {
                    topTracks.push(track.trackName);
                    var topTrackName = showTopTrackName(track.trackName);
                    service_choice_results.append(topTrackName);
                }

            });
            //show loading screen until both calls are made
            checkCompletedData();
            $('#results_container').append(result_container);
        }
        else {
            searchError(serviceChoice);
        }
    });


};

var showAlbumName = function(album_name) {
    var result = $('.templates .result_element').clone();

    var albumElem = result.find('.this_result');
    albumElem.html(album_name);

    return result;
};

var showTopTrackName = function(top_track_name) {
    var result = $('.templates .result_element').clone();

    var trackElem = result.find('.this_result');
    trackElem.html(top_track_name);

    return result;
};

//function for music services for whom the api connections are being analyzed
var comingSoon = function(service_choice_name, comparisonCriteria) {
    checkCompletedData();
    var thisService = "{%s}".replace("{%s}", service_choice_name);
    var thisService = thisService.charAt(0).toUpperCase() + thisService.substring(1);
    var result_container = $('.templates .results').clone();

    var service_choice_name = result_container.find('.result_title');
    service_choice_name.text(thisService);


    var results_criteria = result_container.find('.comparison_title');
    if (comparisonCriteria == undefined) {
        results_criteria.text('This option is currently under development for this service');
    }
    else {
        results_criteria.text('We are working on an API interface with this service');
    }
    $('#results_container').append(result_container);

};

var optionMessage = function(service_choice_name) {
    checkCompletedData();
    var thisService = "{%s}".replace("{%s}", service_choice_name);
    var thisService = thisService.charAt(0).toUpperCase() + thisService.substring(1);
    var result_container = $('.templates .results').clone();

    var service_choice_name = result_container.find('.result_title');
    service_choice_name.text(thisService);

    var results_criteria = result_container.find('.comparison_title');
    results_criteria.text("Please select a music service.");

    //checkCompletedData();
    $('#results_container').append(result_container);
};

var searchError = function(service_choice_name) {
    checkCompletedData();
    var thisService = "{%s}".replace("{%s}", service_choice_name);
    var thisService = thisService.charAt(0).toUpperCase() + thisService.substring(1);
    var result_container = $('.templates .results').clone();

    var service_choice_name = result_container.find('.result_title');
    service_choice_name.text(thisService);

    var results_criteria = result_container.find('.comparison_title');
    results_criteria.text("This service cannot find the artist choice you have entered. Maybe you misspelled it.")

    //checkCompletedData();
    $('#results_container').append(result_container);
};