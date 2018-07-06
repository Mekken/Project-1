$(document).ready(function () {
    var access_token;
    var type = ['artist','playlist','track','album']

    function displayResults(token,query) {

        var searchType = type[0]; // just for testing;
        var cleanQuery = query.replace(" ","%20").trim();
        console.log(cleanQuery);
        var request = `https://api.spotify.com/v1/search?q=${cleanQuery}&type=${searchType}&limit=10`;

        fetch(request, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(function(resJSON) {
                switch(searchType) {
                    case 'artist':
                        artistURI = resJSON.artists.items[0].uri.split(":");
                        displayArtistTopTracks(artistURI[2],token);
                        break;
                    case 'playlist':
                        console.log(resJSON.playlists.items);
                        displayPlaylist();                      
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
            .catch(function() {
                //Display in Div Unable to Find Your Query
                console.log("Failure!");    
            })
    }

    function displayArtistTopTracks(uri,token)
    {
        var request = `https://api.spotify.com/v1/artists/${uri}/top-tracks?country=US`;
        fetch(request, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then((resJSON) => {
            var previewImg,
                albumName,
                trackName,
                trackURL;

            console.log("Artists Top Tracks");
            console.log(resJSON);
            $('.feature-list').empty();
            
            resJSON.tracks.forEach(function(track, idx){
                console.log("Track Information");
                previewImg = track.album.images[1].url;
                albumName = track.album.name;
                trackName = track.name;
                trackURI = track.uri;
                console.log(track);
                console.log(previewImg);
                console.log(albumName);
                console.log(trackName);
                console.log(trackURI + "\n\n");

                var liElem = $('<li>').addClass('row justify-content-center align-items-center info-container mb-4');
                var imgDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5 img-container');
                var imgElem = $('<img>').attr('src',previewImg).addClass('preview-imgs');

                var infoDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5');
                infoDiv.append(`<h5>#${idx+1} Track!</h5><p>Album: ${albumName}</p><p>Track: ${trackName}</p><iframe src="https://open.spotify.com/embed?uri=${trackURI}" width="300" height="80" frameborder="0" allowtransparency="true" ></iframe>`)

                imgDiv.append(imgElem);
                liElem.append(imgDiv).append(infoDiv);
                $('.feature-list').append(liElem);
            })
        })
    }

    function displayPlaylist(playlist)
    {

    }

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

    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        var input = $('#search-text').val();
        console.log(input);
        search(input);
    });

    // TODO make artist call here
    $("#artist").on("click", function (event) {
        event.preventDefault();
    })    

    // TODO make track call here
    $("#track").on("click", function (event) {
        event.preventDefault();
    })

    //TODO make album call here
    $("#album").on("click", function (event) {
        event.preventDefault();
    })

    // TODO make playlist call here
    $("#playlist").on("click", function (event) {
        event.preventDefault();
    })

})