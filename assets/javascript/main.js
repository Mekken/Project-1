$(document).ready(function () {
    var access_token;
    $("button").click(function() {
        console.log('You clicked on ' + this.id);
    });

    //AJAX Setup


    var type = ['artist','playlist','track','album']


    //TODO: Random Function Here


    function displayResults(token,query) {

        // var searchType = // just for testing type[3];
        var request = `https://api.spotify.com/v1/search?q=${query}&type=${searchType}&limit=10`;

        fetch(request, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(function(resJSON) {
                console.log(resJSON);
                switch(searchType) {
                    case 'artist':
                        console.log(resJSON.artists.items);
                        //Create Elements for artists and display in HTML
                        break;
                    case 'playlist':
                        console.log(resJSON.playlists.items);
                        //Create Elements for playlists and display in HTML                        
                        break;
                    case 'track':
                        console.log(resJSON.tracks.items);
                        //Create Elements for tracks and display in HTML
                        break;
                    case 'album':
                        console.log(resJSON.albums.items);
                        //Create Elements for albums and display in HTML
                        break;
                    default:
                        console.log(resJSON.tracks.items);
                        //Create Elements for tracks and display in HTML
                        break;
                }
            })
    }

    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        var input = $('#search-text').val();
        console.log(input);
        search(input);
    });

    // TODO make artist call here
    $("#artist").on("click", function (event) {
        event.preventDefault();
        // authenticate();
    })    

    // TODO make track call here
    $("#track").on("click", function (event) {
        event.preventDefault();
        // authenticate();
    })

    //TODO make album call here
    $("#album").on("click", function (event) {
        event.preventDefault();
        // authenticate();
    })

    // TODO make playlist call here
    $("#playlist").on("click", function (event) {
        event.preventDefault();
        // authenticate();
    })

    function search(searchQuery) {

        var request = 'https://accounts.spotify.com/api/token';
        var authToken = window.btoa("797ea0763f8640698f707a7b03d85cf2:2b683093784142a996e161825afd0d26");

        $.ajaxPrefilter(function (options) {
            if (options.crossDomain && $.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        $.ajax({
                method: 'POST',
                url: request,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${authToken}`
                },
                data: {
                    "grant_type": "client_credentials"
                }
            })
            .then(res => res.access_token)
            .then(function (token) {
                displayResults(token,searchQuery);
            })
    }

})
