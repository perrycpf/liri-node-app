require('dotenv').config();
var fs = require('fs');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var keys = require('./keys.js');
var NodeGeocoder = require('node-geocoder');

var spotify = new Spotify(keys.spotify);

// Return n/a instead of null to the output
function checkNull(value) {
    return (value == null) ? "n/a" : value;
}

function concertThis(searchThis) {
    if (searchThis == "") {
        return console.log('Please enter an artist or a band name for searching!');
    }

    return new Promise(function (resolve, reject) {
        var queryUrl = "https://rest.bandsintown.com/artists/" + searchThis + "/events?app_id=codingbootcamp";

        axios.get(queryUrl)
            .then(function (response) {

                if (response.data.length < 1)
                    return console.log('No concerts were found!');

                var results = response.data;
                var venues = [];

                function getLocation(result) {
                    return new Promise(function (resolve, reject) {
                        var options = {
                            provider: 'mapquest',

                            // Optional depending on the providers
                            httpAdapter: 'https', // Default
                            apiKey: 'YZKhLIHMZRNfF4CGC5Ue2QXOM91BpJ2S' // for Mapquest, OpenCage, Google Premier
                        };
                        var geocoder = NodeGeocoder(options);
                        var lat = result.venue.latitude;
                        var lon = result.venue.longitude;

                        geocoder.reverse({ lat: lat, lon: lon }, (err, data) => {
                            if (err)
                                console.log(err);
                            else {
                                venues.push({
                                    name: result.venue.name,
                                    streetName: data[0].streetName,
                                    city: data[0].city,
                                    zipcode: data[0].zipcode,
                                    country: result.venue.country,
                                    datetime: result.datetime
                                })
                                resolve();
                            }
                        });
                    });
                }

                // Use Promise to handle nested asynchronous api calls for combining the results
                let venuePromises = results.map(getLocation);

                Promise.all(venuePromises)
                    .then(() => {
                        function compare(a, b) {
                            if (a.datetime < b.datetime)
                                return -1;
                            if (a.datetime > b.datetime)
                                return 1;
                            return 0;
                        }
                        // Sort the event dates in chronological order  
                        venues.sort(compare);
                        console.log(`------------ concert-this ${searchThis} -------------`);
                        for (var i = 0; i < venues.length; i++) {
                            console.log(`Venue: ${venues[i].name}`);
                            console.log(`Street Name: ${venues[i].streetName}`);
                            console.log(`City: ${venues[i].city}`);
                            console.log(`Zip Code: ${venues[i].zipcode}`);
                            console.log(`Country: ${venues[i].country}`);
                            console.log(`Date of the Event: ${venues[i].datetime = moment(venues[i].datetime).format("L")}`);
                            console.log('---------------------------------------');
                        }
                        venues.unshift(`------------ concert-this ${searchThis} -------------`);
                        fs.appendFile("log.txt", JSON.stringify(venues, null, 2) + '\n', function (err) {
                            if (err)
                                console.log(err);
                        });
                    })
                    .catch(() => {
                        console.log(err);
                    });
                resolve();
            })
            .catch(function (err) {
                console.log(err);
            });
    });
}


function spotifyThisSong(searchThis) {
    // If no song is proivded then make it default to the following song.
    var songs = [];
    if (searchThis == "") {
        searchThis = "The Sign by Ace of Base";
    }
    spotify.search({ type: 'track', query: searchThis }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(`------------ spotify-this-song ${searchThis} -------------`);

        if (data.tracks.total > 0) {

            var names = "";
            for (i = 0; i < Object.keys(data.tracks).length; i++) {
                // Show more than one artist
                names = data.tracks.items[i].artists.map(function (artist) {
                    return artist['name'];
                });
                console.log(`Artist(s): ${names.toString()}`);
                console.log(`The song's name: ${data.tracks.items[i].name}`);
                console.log(`A preview link from Spotify: ${checkNull(data.tracks.items[i].preview_url)}`);
                console.log(`The album: ${data.tracks.items[i].album.name}`);
                console.log('---------------------------------------');
                songs.push({
                    artists: names.toString(),
                    song: data.tracks.items[i].name,
                    preview_url: checkNull(data.tracks.items[i].preview_url),
                    album_name: data.tracks.items[i].album.name
                });
            }
            songs.unshift(`------------ spotify-this-song ${searchThis} -------------`);
            fs.appendFile("log.txt", JSON.stringify(songs, null, 2) + '\n', function (err) {
                if (err)
                    console.log(err);
            });
        } else {
            console.log('No songs were found!');
        }
    });
}

function movieThis(searchThis) {
    var movie = [];

    if (searchThis == "") {
        searchThis = "Mr. Nobody";
    }
    var queryUrl = "https://www.omdbapi.com/?t=" + searchThis + "&type=movie&plot=short&apikey=trilogy";

    axios.get(queryUrl)
        .then(function (response) {

            var result = response.data;

            if (result.Response == "False")
                return console.log("No movie was found!");

            console.log(`------------ movie-this ${searchThis} -------------`);

            movie.push({
                title: result.Title,
                year: result.Year,
                imdbRating: result.imdbRating,
                rTomatoRating: result.Ratings[1].Value,
                country: result.Country,
                language: result.Language,
                plot: result.Plot,
                actors: result.Actors
            })

            console.log(`Title of the movie: ${movie[0].title}`);
            console.log(`Year of the movie: ${movie[0].year}`);
            console.log(`IMDb rating: ${movie[0].imdbRating}`);
            console.log(`Rotten tomatoes rating: ${movie[0].rTomatoRating}`);
            console.log(`Country produced: ${movie[0].country}`);
            console.log(`Movie language(s): ${movie[0].language}`);
            console.log(`Movie plot: ${movie[0].plot}`);
            console.log(`Cast: ${movie[0].actors}`);

            movie.unshift(`------------ movie-this ${searchThis} -------------`);
            fs.appendFile("log.txt", JSON.stringify(movie, null, 2) + '\n', function (err) {
                if (err)
                    console.log(err);
            });
        })
        .catch(function (err) {
            console.log(err);
        });
}

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err)
            return console.log(err);

        var inputArr = data.split(',');
        var actionThis = inputArr[0];
        var searchThis = inputArr[1];

        console.log(`------------ do-what-it-says: ${actionThis} ${searchThis} -------------`);

        fs.appendFile("log.txt", `------------ do-what-it-says: ${actionThis} ${searchThis} -------------` + '\n', function (err) {
            if (err)
                console.log(err);
        });

        liriCommand(actionThis, searchThis);

    });
}

function liriCommand(action, parms) {


    switch (action) {
        case 'concert-this':
            concertThis(parms);
            break;
        case 'spotify-this-song':
            spotifyThisSong(parms);
            break;
        case 'movie-this':
            movieThis(parms);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('Invalid action!!!');
    }

};

var action = process.argv[2];
var parms = process.argv.slice(3).join(" ");

liriCommand(action, parms);