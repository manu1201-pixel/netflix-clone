// 1. API Configuration
const api_key = "3751aaaeddac3468270e8e4c7732a638"; 
const base_url = "https://api.themoviedb.org/3";
const banner_url = "https://image.tmdb.org/t/p/original";
const img_url = "https://image.tmdb.org/t/p/w300";

// 2. Movie Request URLs
const requests = {
    fetchTrending: `${base_url}/trending/all/week?api_key=${api_key}&language=en-US`,
    fetchNetflixOriginals: `${base_url}/discover/tv?api_key=${api_key}&with_networks=213`,
    fetchActionMovies: `${base_url}/discover/movie?api_key=${api_key}&with_genres=28`,
    fetchComedyMovies: `${base_url}/discover/movie?api_key=${api_key}&with_genres=35`,
    fetchHorrorMovies: `${base_url}/discover/movie?api_key=${api_key}&with_genres=27`,
    fetchRomanceMovies: `${base_url}/discover/movie?api_key=${api_key}&with_genres=10749`,
    fetchDocumentaries: `${base_url}/discover/movie?api_key=${api_key}&with_genres=99`,
};

// 3. The Function to Get Movies
function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

// 4. The Magic Function
fetch(requests.fetchNetflixOriginals)
    .then((res) => res.json())
    .then((data) => {
        // A. Pick a random movie from the list of 20
        const setMovie = data.results[Math.floor(Math.random() * data.results.length - 1)];

        // B. Target the HTML elements
        var banner = document.querySelector(".banner");
        var banner_title = document.querySelector(".banner-title");
        var banner_desc = document.querySelector(".banner-description");

        // C. Update the HTML with real data
        banner.style.backgroundImage = "url(" + banner_url + setMovie.backdrop_path + ")";
        banner_title.innerText = setMovie.name; // TV shows use "name", Movies use "title"
        banner_desc.innerText = truncate(setMovie.overview, 150);
    });

    // 5. Netflix Originals Row (Tall Posters)
fetch(requests.fetchNetflixOriginals)
    .then((res) => res.json())
    .then((data) => {
        const headrow = document.getElementById("netflix-row");
        const movies = data.results;

        movies.forEach((movie) => {
            // Create the image tag
            const poster = document.createElement("img");
            // Add the classes
            poster.className = "row-poster row-posterLarge";
            // Set the ID (optional, but good for later)
            var s = movie.name.replace(/\s+/g, "");
            poster.id = s;
            // Set the Image Source
            poster.src = img_url + movie.poster_path;

            // ... existing poster code ...
            poster.src = img_url + movie.poster_path;

            // ADD THIS CLICK EVENT 👇
            poster.onclick = function() {
                handleClick(movie);
            };

            headrow.appendChild(poster);
           
        });
    });

// 6. Trending Row (Wide Posters)
fetch(requests.fetchTrending)
    .then((res) => res.json())
    .then((data) => {
        const headrow = document.getElementById("trending-row");
        const movies = data.results;

        movies.forEach((movie) => {
            const poster = document.createElement("img");
            poster.className = "row-poster"; // Standard size
            var s = movie.id;
            poster.id = s;
            poster.src = img_url + movie.backdrop_path; // Wide image

            // ... existing poster code ...
            poster.src = img_url + movie.poster_path;

            // ADD THIS CLICK EVENT 👇
            poster.onclick = function() {
                handleClick(movie);
            };

            headrow.appendChild(poster);
           
        });
    });

    // SCROLL BUTTON LOGIC
function scrollR(elementId) {
    var row = document.getElementById(elementId);
    row.scrollBy({
        left: 400, // Scroll 400 pixels to the right
        behavior: 'smooth' // Make it slide smoothly
    });
}

function scrollL(elementId) {
    var row = document.getElementById(elementId);
    row.scrollBy({
        left: -400, // Scroll 400 pixels to the left
        behavior: 'smooth'
    });
}

// 7. THE TRAILER FUNCTIONS
// This function runs when you click a poster
function handleClick(movie) {
    // A. Hide any open trailer first
    document.getElementById("trailer-container").style.display = "none";
    
    // B. Clear the old video so it stops playing sound
    document.getElementById("video-frame").src = "";

    // C. Search for the trailer
    // We try to find the movie name or title
    let movieName = movie.name || movie.title || "";
    
    console.log("Searching for trailer: " + movieName); // Debug check

    movieTrailer(movieName)
        .then((url) => {
            // The tool returns a full link like: https://www.youtube.com/watch?v=XtMThy8QKqU
            // We only want the ID part: XtMThy8QKqU
            const urlParams = new URLSearchParams(new URL(url).search);
            const videoId = urlParams.get("v");
            
            if (videoId) {
                // D. Show the video player
                document.getElementById("video-frame").src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                document.getElementById("trailer-container").style.display = "block";
            } else {
                alert("Sorry, no trailer found for " + movieName);
            }
        })
        .catch((error) => {
            console.log(error);
            alert("Could not find trailer for " + movieName);
        });
}

// This function runs when you click "CLOSE X"
function closeTrailer() {
    document.getElementById("trailer-container").style.display = "none";
    document.getElementById("video-frame").src = "";
}