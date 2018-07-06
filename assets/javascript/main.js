$(document).ready(function () {
    var access_token;
    var searchType = undefined;

    function displayRandomArtists()
    {
        //fetch("/assets/javascript/artists.txt", {mode: 'no-cors'}).then(responee => console.log(response));
    }

    function displayResults(token,query) {

        if(!searchType)
            searchType = "artist";
        var cleanQuery = query.replace(" ","%20").trim();
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
                        var artistURI = resJSON.artists.items[0].uri.split(":");
                        displayArtistTopTracks(artistURI[2],token);
                        break;
                    case 'playlist':
                        var playlistItems = resJSON.playlists.items;
                        displayPlaylist(playlistItems);  
                        break;
                    case 'track':
                        var trackItems = resJSON.tracks.items;
                        console.log(resJSON.tracks.items);
                        displayTracks(trackItems);
                        break;
                    case 'album':
                        console.log(resJSON.albums.items);
                        //Create Elements for albums and display in HTML
                        break;
                    default:
                        console.log(resJSON.tracks.items);
                        displayTracks(trackItems);
                        break;
                }
            })
            .catch(function(error) {
                //Display in Div Unable to Find Your Query
                console.log("Error Details: ");
                console.log(error);    
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
                trackURI;

            $('.feature-list').empty();
            
            resJSON.tracks.forEach(function(track, idx){
                // console.log("Track Information");
                var previewImg = track.album.images[1].url,
                    albumName = track.album.name,
                    trackName = track.name,
                    trackURI = track.uri;
                
                // console.log(track);
                // console.log(previewImg);
                // console.log(albumName);
                // console.log(trackName);
                // console.log(trackURI + "\n\n");

                var liElem = $('<li>').addClass('row justify-content-center align-items-center info-container');
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
        $('.feature-list').empty();

        console.log("Playlist Information");
        playlist.forEach((playlist,idx) => {
            console.log(`playlist #${idx}`);
            var plName = playlist.name,
                plImg = playlist.images[0].url,
                plURI = playlist.uri;
            console.log(plName);
            console.log(plImg);
            console.log(plURI);
  
            var liElem = $('<li>').addClass('row justify-content-center align-items-center info-container');
            var imgDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5 img-container');
            var imgElem = $('<img>').attr('src',plImg).addClass('preview-imgs');
    
            var infoDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5');
            infoDiv.append(`<h5>Playlist: ${plName}</h5><iframe src="https://open.spotify.com/embed?uri=${plURI}" width="300" height="300" frameborder="0" allowtransparency="true" ></iframe>`)
    
            imgDiv.append(imgElem);
            liElem.append(imgDiv).append(infoDiv);
            $('.feature-list').append(liElem);
        })
    }

    
    function displayTracks(tracks)
    {
        $('.feature-list').empty();

        console.log("Track Information");
        tracks.forEach((track,idx) => {
            console.log(`Track #${idx}`);
            var trackName = track.name,
                albumName = track.album.name,
                trackImg = track.album.images[0].url,
                trackURI = track.uri;
            console.log(trackName);
            console.log(albumName);
            console.log(trackImg);
            console.log(trackURI);

        
            var liElem = $('<li>').addClass('row justify-content-center align-items-center info-container');
            var imgDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5 img-container');
            var imgElem = $('<img>').attr('src',trackImg).addClass('preview-imgs');
    
            var infoDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5');
            infoDiv.append(`<h5>#${idx+1} Track!</h5><p>Album: ${albumName}</p><p>Track: ${trackName}</p><iframe src="https://open.spotify.com/embed?uri=${trackURI}" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>`)
    
            imgDiv.append(imgElem);
            liElem.append(imgDiv).append(infoDiv);
            $('.feature-list').append(liElem);
        })
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
        searchType = "artist";
    })    

    // TODO make track call here
    $("#track").on("click", function (event) {
        event.preventDefault();
        searchType = "track";
    })

    //TODO make album call here
    $("#album").on("click", function (event) {
        event.preventDefault();
        searchType = "album";
    })

    // TODO make playlist call here
    $("#playlist").on("click", function (event) {
        event.preventDefault();
        searchType = "playlist";
    })

    displayRandomArtists();

})