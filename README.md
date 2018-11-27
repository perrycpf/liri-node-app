# liri-node-app

LIRI is a Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

This application was built by using node.js, axios, moment, keys, dotenv, fs, node-spotify-api, band-in-town-api, OMDb-api.

Each command should do, and information will be rendered for each event to the terminal and log.txt:

1. node liri.js concert-this <artist/band name here>:

	Name of the venue
	Venue location
	Date of the Event
	
2. node liri.js spotify-this-song <song name here>:

	Artist(s)
	The song's name
	A preview link of the song from Spotify
	The album that the song is from
	
3. node liri.js movie-this <movie name here>
	
	Title of the movie.
    Year the movie came out.
    IMDB Rating of the movie.
    Rotten Tomatoes Rating of the movie.
    Country where the movie was produced.
    Language of the movie.
    Plot of the movie.
    Actors in the movie.
	
4. node liri.js do-what-it-says

	It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt