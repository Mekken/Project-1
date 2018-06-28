$(document).ready(function() {
    var access_token;

    //AJAX Setup
    $.ajaxPrefilter(function(options) {
        if (options.crossDomain && $.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    //TODO: Random Function Here

    //TODO: Search Funcion Here

    // Testing Authentication
    function authenticate()
    {
        var request = 'https://accounts.spotify.com/api/token';
        var authToken = window.btoa("797ea0763f8640698f707a7b03d85cf2:2b683093784142a996e161825afd0d26");

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
        .then(function(token) {
            console.log(`Token ${token}`);
            //TODO: Logic for Search and Recommendation Functions
        })
    }

    authenticate();
})
