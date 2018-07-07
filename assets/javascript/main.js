$(document).ready(function () {
    var authToken = window.btoa("797ea0763f8640698f707a7b03d85cf2:2b683093784142a996e161825afd0d26");
    var searchType = undefined;
      
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD3lh4eYLoz0kNa14f2RsFShPHeaEF0H1U",
        authDomain: "ucsdproject-1.firebaseapp.com",
        databaseURL: "https://ucsdproject-1.firebaseio.com",
        projectId: "ucsdproject-1",
        storageBucket: "ucsdproject-1.appspot.com",
        messagingSenderId: "714661524234"
    };

    //Initialize Heroku
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && $.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });


    //Initialize Database and a list of artists into the database
    function initDatabase(){
        var db = firebase.initializeApp(config).database();
        db.ref().on("value",function(snapshot) {
            if(!snapshot.child('artists').exists()) {
                db.ref('artists').set({
                    names: [ "Drake",
                    "Taylor Swift", 
                    "Ed Sheeran", 
                    "Beyonce",
                    "The Weeknd", 
                    "Imagine Dragons", 
                    "Bruno Mars",
                    "Ariana Grande",
                    "Calvin Harris",
                    "Dua Lipa",
                    "Post Malone", 
                    "Sia",
                    "Selena Gomez",
                    "Marshmello",
                    "Nicki Minaj",
                    "Rihanna",
                    "Eminem",
                    "Kendrick Lamar",
                    "Justin Bieber"]
                })
            }
            else
            {
                console.log("Number of Artists");
                artistList = snapshot.val().artists.names;
                console.log(artistList.length);
                
                var randNum = Math.floor(Math.random() * artistList.length);
                console.log("Random Number: " + randNum);
                console.log("Artist: " + artistList[randNum]);                
                
                displayArtistInfo(artistList[randNum]);
            }

        }, function(error) {
            console.log("Caught an Exception: " + error.Code);
        })
    }

    //Make Search Call to Get Artist Information
    function displayArtistInfo(artistName)
    {
        var request = 'https://accounts.spotify.com/api/token';

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
                console.log("ArtistName: " + artistName);
                var request = `https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=1`;

                fetch(request, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then((resJSON) => {
                    //Grab Artist information
                    console.log(resJSON);

                    $('.feature-list').empty();
                    var artistName = resJSON.artists.items[0].name,
                        genres = resJSON.artists.items[0].genres,
                        artistImg = resJSON.artists.items[0].images[1].url,
                        artistFollowers = resJSON.artists.items[0].followers.total;
                        artistId = resJSON.artists.items[0].id,
                        genresDiv = null

                    console.log("Artist Information: ");
                    console.log(artistName);
                    console.log(genres);
                    console.log(artistImg);

                    genresDiv = $("<div>");
                    genres.forEach(function(genre,idx) {
                        genresDiv.append(`${genre}<br>`);
                    })

                
                    var liElem = $('<li>').addClass('row justify-content-center align-items-center info-container mb-4');
                    var imgDiv = $('<div>').addClass('col-md-5.5 img-container');
                    var imgElem = $('<img>').attr('src',artistImg).addClass('preview-imgs');
    
                    var infoDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5');
                    infoDiv.append(`<h5>Check This Artist Info!</h5>`).append(`<h6>Total Followers: ${artistFollowers}</h6>`).append(`<h6>Genres: </h6>`).append(genresDiv).append(`<a target="_blank" href="https://open.spotify.com/artist/${artistId}">More about this artist ></a>`);
    
                    imgDiv.append(imgElem);
                    liElem.append(imgDiv).append(infoDiv);
                    $('.feature-list').append(liElem);
                }) 
        })
    }

    //Display Results of Search Query
    function displayResults(token,query,limit = 10) {

        if(!searchType)
            searchType = "artist";
        var cleanQuery = query.trim().replace(/\s+/g,"%20");
        var request = `https://api.spotify.com/v1/search?q=${cleanQuery}&type=${searchType}&limit=${limit}`;

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
                        console.log(trackItems);
                        displayTracks(trackItems);
                        break;
                    case 'album':
                        var albumItems = resJSON.albums.items; 
                        console.log(albumItems);
                        displayAlbums(albumItems);
                        break;
                    default:
                        console.log(resJSON.tracks.items);
                        displayTracks(trackItems);
                        break;
                }
            })
            .catch(function(error) {
                //Display in Div Unable to Find Your Query
                $('.feature-list').empty().append(`<h5>OOPS!</h5><p>Looks Like we were unable to find what you were looking for.</p><p>Please Try Again</p>`).attr('style','text-align: center;');
            })
    }

    //Display Top Artists Tracks to the WebPage
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

                var liElem = $('<li>').addClass('row justify-content-center align-items-center info-container mb-4');
                var imgDiv = $('<div>').addClass('col-md-5.5 img-container');
                var imgElem = $('<img>').attr('src',previewImg).addClass('preview-imgs');

                var infoDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5');
                infoDiv.append(`<h5>#${idx+1} Track!</h5><p>Album: ${albumName}</p><p>Track: ${trackName}</p><iframe src="https://open.spotify.com/embed?uri=${trackURI}" width="300" height="80" frameborder="0" allowtransparency="true" ></iframe>`)

                imgDiv.append(imgElem);
                liElem.append(imgDiv).append(infoDiv);
                $('.feature-list').append(liElem);
            })
        })
    }

    //Display Ten Related Playlists based on Search Query
    function displayPlaylist(playlist)
    {
        $('.feature-list').empty();

        // console.log("Playlist Information");
        playlist.forEach((playlist,idx) => {
            // console.log(`playlist #${idx}`);
            var plName = playlist.name,
                plImg = playlist.images[0].url,
                plURI = playlist.uri;

            // console.log(plName);
            // console.log(plImg);
            // console.log(plURI);
  
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

    //Display Ten Related Tracks based on Search Query
    function displayTracks(tracks)
    {
        $('.feature-list').empty();

        // console.log("Track Information");
        tracks.forEach((track,idx) => {
            // console.log(`Track #${idx}`);
            var trackName = track.name,
                albumName = track.album.name,
                trackImg = track.album.images[0].url,
                trackURI = track.uri;

            // console.log(trackName);
            // console.log(albumName);
            // console.log(trackImg);
            // console.log(trackURI);

        
            var liElem = $('<li>').addClass('row justify-content-center align-items-center info-container');
            var imgDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5 img-container');
            var imgElem = $('<img>').attr('src',trackImg).addClass('preview-imgs');
    
            var infoDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5');
            infoDiv.append(`<h5>Track ${idx+1}</h5><p>Album: ${albumName}</p><p>Track: ${trackName}</p><iframe src="https://open.spotify.com/embed?uri=${trackURI}" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>`)
    
            imgDiv.append(imgElem);
            liElem.append(imgDiv).append(infoDiv);
            $('.feature-list').append(liElem);
        })
    }

    //Display Ten Related Albums based on Search Query
    function displayAlbums(tracks)
    {
        $('.feature-list').empty();

        // console.log("Album Information");
        tracks.forEach((album,idx) => {
            // console.log(`Album #${idx}`);
            var albumName = album.name,
                albumType = album.album_type,
                albumImg = album.images[0].url,
                albumURI = album.uri;

            // console.log(albumName);
            // console.log(albumType);
            // console.log(albumImg);
            // console.log(albumURI);

        
            var liElem = $('<li>').addClass('row justify-content-center align-items-center info-container');
            var imgDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5 img-container');
            var imgElem = $('<img>').attr('src',albumImg).addClass('preview-imgs');
    
            var infoDiv = $('<div>').addClass('col-12 col-md-6 col-lg-5');
            infoDiv.append(`<h5>Album ${idx+1}</h5><p>Album: ${albumName}</p><p>Album Type: ${albumType}</p><iframe src="https://open.spotify.com/embed?uri=${albumURI}" width="300" height="300" frameborder="0" allowtransparency="true"></iframe>`)
    
            imgDiv.append(imgElem);
            liElem.append(imgDiv).append(infoDiv);
            $('.feature-list').append(liElem);
        })
    }

    //Get Access Token and then initiate Search
    function search(searchQuery) {
        var request = 'https://accounts.spotify.com/api/token';

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

    $("#artist").on("click", function (event) {
        event.preventDefault();
        searchType = "artist";
    })    

    $("#track").on("click", function (event) {
        event.preventDefault();
        searchType = "track";
    })

    $("#album").on("click", function (event) {
        event.preventDefault();
        searchType = "album";
    })

    $("#playlist").on("click", function (event) {
        event.preventDefault();
        searchType = "playlist";
    })

    initDatabase();
})
