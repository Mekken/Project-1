$(document).ready(function () {
    var access_token;
    $("button").click(function() {
        console.log('You clicked on ' + this.id);
    });

    //AJAX Setup


    //TODO: Random Function Here


    //TODO: Search Function Here
    function search(token) {

        //var userMark = ['US','']
        var request = 'https://api.spotify.com/v1/search?q=party&type=artist,track&market=US&limit=10';

        fetch(request, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(resJSON => console.log(resJSON))

        var results = response.data;


    }

    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        authenticate();

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

    // Testing Authentication
    function authenticate() {
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
                console.log(`Token ${token}`);
                search(token);
                //TODO: Logic for Search and Recommendation Functions
            })
    }

})