//Add code to read and set any environment variables with the dotenv package
require("dotenv").config();

//Add the code required to import the keys.js
var keys = require("./keys.js");

//Load the packages needed
//Use Moment to change the date format to MM/DD/YYYY
var moment = require("moment");
moment().format();

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");

// Add a divider
var divider = "\n---------------------------\n"

// Liri apps argv and input
var app = process.argv[2];
var input = process.argv[3];

// The switch-case will direct which app/fuction gets run.
switch (app) {
    case "concert-this":
        concerts(input)
        break;
    case "spotify-this-song":
        spotifying(input)
        break;
    case "movie-this":
        movies(input)
        break;
    case "do-what-it-says":
        doit()
        break;
}

// 
function concerts(input) {
    var queryURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp"

    axios.get(queryURL).then(function(response) {

        for(i=0; i < response.data.length; i++) {
            var date = response.data[i].datetime;
            date = moment(date).format("MM/DD/YYYY");
            console.log("Name of the venue: " + response.data[i].venue.name);
            console.log("Venue location: " + response.data[i].venue.city);
            console.log("Date of the Event: " + date);
            console.log(divider);

            var showData = [
                "Name of the venue: " + response.data[i].venue.name,
                "Venue location: " + response.data[i].venue.city,
                "Date of the Event: " + date
            ].join("\n\n");
        }
        
        // fs.appendFile("log.txt", showData + divider, function (err) {
            // if (err) throw err;
        // });
    });
}

function spotifying(input) {
    if (!input) {
        input = "The Sign";
    }

    // var queryURL = "https://api.spotify.com/v1/search?q" + input + 
    
    spotify.search({ type: "track", query: input }, function(err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
                    }
             console.log(data);
        });

        var songData = data.tracks.items;
        // for (i = 0; i < data.length; i++) {
            console.log("Artist(s): " + songData[0].artist[0].name);
            console.log("Song's Name: " + songData[0].name);
            console.log("Preview Link: " + songData[0].preview_url);
            console.log("Album's Name: " + songData[0].album.name);
        // }

        var showData = [
            "Artist(s): " + songData[0].artist[0].name,
            "Song's Name: " + songData[0].name,
            "Preview Link: " + songData[0].preview_url,
            "Album's Name: " + songData[0].album.name
        ].join("\n\n");

         // fs.appendFile("log.txt", showData + divider, function (err) {
            // if (err) throw err;
        // });
    }
    
            
function movies(input) {
    if (!input) {
        input = "Mr. Nobody";
    }

    var queryUrl =
        "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=9613e41";

    axios.get(queryUrl).then(function (response) {
        //console.log(response);
        console.log("Title of the movie: " + response.data.Title);
        console.log("Year the movie came out: " + response.data.Year);
        console.log("IMDB Rating of the movie: " + response.data.imdbRating);
        console.log(
            "Rotten Tomatoes Rating of the movie: " + response.data.Ratings[0].Value
        );
        console.log(
            "Country where the movie was produced: " + response.data.Country
        );
        console.log("Language of the movie: " + response.data.Language);
        console.log("Plot of the movie: " + response.data.Plot);
        console.log("Actors in the movie: " + response.data.Actors);
        

        var showData = [
            "Title of the movie: " + response.data.Title,
            "Year the movie came out: " + response.data.Year,
            "IMDB Rating of the movie: " + response.data.imdbRating,
            "Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value,
            "Country where the movie was produced: " + response.data.Country,
            "Language of the movie: " + response.data.Language,
            "Plot of the movie: " + response.data.Plot,
            "Actors in the movie: " + response.data.Actors
        ].join("\n\n");

        fs.appendFile("log.txt", showData + divider, function (err) {
            if (err) throw err;
        });
    });
}

function doit(input) {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        if (dataArr[0] === "concert-this") {
            var concertSearch = dataArr[1].slice(1, -1);
            concerts(concertSearch);
        } else if (dataArr[0] === "spotify-this-song") {
                var songSearch = dataArr[1].slice(1, -1);
                spotifying(songSearch);
        } else if (dataArr[0] === "movie-this") {
            var movieName = dataArr[1].slice(1, -1);
            movie(movieName);
        }
    });
}