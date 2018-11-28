# liri-node-app

LIRI is a Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

Getting started
1. Please clone repo into your computer
2. Run npm install in GitBash

This application was built by using node.js, axios, moment, keys, dotenv, fs, node-spotify-api, band-in-town-api, OMDb-api.

Each command should do with the following instructions, and information will be rendered for each event to the terminal and log.txt:

1. node liri.js concert-this /{artist/band name here}:

	--* Name of the venue
	2 Venue location
	3 Date of the Event
	
2. node liri.js spotify-this-song {song name here}:

	Artist(s)
	The song's name
	A preview link of the song from Spotify
	The album that the song is from
	
3. node liri.js movie-this {movie name here}:
	
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

[The user flow video file](./assets/video/user-flow.mp4)
